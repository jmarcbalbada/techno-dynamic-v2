from rest_framework.viewsets import ModelViewSet

from .NoticeNotifierController import NoticeNotifierController
from .FaqController import FaqController
from api.model.RelatedContent import  RelatedContent
from api.serializer.RelatedContentSerializer import  RelatedContentSerializer
from api.model.Faq import Faq
from api.model.Lesson import Lesson
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from api.model.Teacher import Teacher
from rest_framework.response import Response
from sentence_transformers import SentenceTransformer, util
import warnings

import numpy as np

from api.model.GroupedQuestions import GroupedQuestions
from api.model.Notification import Notification

# Load the pre-trained model
warnings.filterwarnings("ignore", category=FutureWarning, module="huggingface_hub.file_download")

model = SentenceTransformer('all-MiniLM-L6-v2')


class RelatedContentController(ModelViewSet):
    queryset = RelatedContent.objects.all()
    serializer_class = RelatedContentSerializer

    @staticmethod
    def process_message_and_add_to_faq(lesson_id, message):
        related_contents = RelatedContent.objects.filter(lesson_id=lesson_id)
        lesson = Lesson.objects.get(id=lesson_id)

        # Check if there are any related contents
        if not related_contents.exists():
            # If no related contents exist, create a new related content and FAQ entry
            new_related_content = RelatedContent.objects.create(
                lesson=lesson,
                general_context=message
            )
            grouped_questions = GroupedQuestions.objects.create(
                related_content=new_related_content,
                lesson=lesson,
            )
            Faq.objects.create(
                lesson=lesson,
                related_content=new_related_content,
                grouped_questions=grouped_questions,
                question=message
            )
            return

        contexts = [rc.general_context for rc in related_contents]
        contexts.append(message)

        # Compute embeddings
        message_embeddings = model.encode(contexts)
        new_message_embedding = message_embeddings[-1]
        existing_message_embeddings = message_embeddings[:-1]

        # Calculate cosine similarity between the new message and each existing message
        cosine_sim = util.pytorch_cos_sim(new_message_embedding, existing_message_embeddings).numpy()

        if cosine_sim.size == 0:
            # Handle the case when there are no embeddings to compare
            new_related_content = RelatedContent.objects.create(
                lesson=lesson,
                general_context=message
            )
            grouped_questions = GroupedQuestions.objects.create(
                related_content=new_related_content,
                lesson=lesson,
            )
            Faq.objects.create(
                lesson=lesson,
                related_content=new_related_content,
                grouped_questions=grouped_questions,
                question=message
            )
            return

        max_sim_index = int(np.argmax(cosine_sim))
        max_sim_value = np.max(cosine_sim)

        # Threshold for similarity
        SIMILARITY_THRESHOLD = Teacher.objects.filter(id=1).first().threshold
        NOTIFICATION_THRESHOLD = Teacher.objects.filter(id=1).first().notification_threshold

        if max_sim_value >= SIMILARITY_THRESHOLD:
            matching_related_content = related_contents[max_sim_index]
            grouped_questions = GroupedQuestions.objects.filter(lesson=lesson, related_content=matching_related_content,
                                                                notified=False).first()

            if not grouped_questions:
                grouped_questions = GroupedQuestions.objects.create(
                    related_content=matching_related_content,
                    lesson=lesson,
                )

            faq_count = Faq.objects.filter(related_content=matching_related_content, lesson=lesson,
                                           grouped_questions=grouped_questions).count() + 1

            if faq_count >= NOTIFICATION_THRESHOLD:
                create_notification = Notification.objects.create(
                    lesson=lesson,
                    message="Notification message"
                )
                grouped_questions.notification = create_notification
                grouped_questions.notified = True
                grouped_questions.save()

            faq = Faq.objects.create(
                lesson=lesson,
                related_content=matching_related_content,
                grouped_questions=grouped_questions,
                question=message
            )
            faq.save()
        else:
            new_related_content = RelatedContent.objects.create(
                lesson=lesson,
                general_context=message
            )
            grouped_questions = GroupedQuestions.objects.create(
                related_content=new_related_content,
                lesson=lesson,
            )
            faq = Faq.objects.create(
                lesson=lesson,
                related_content=new_related_content,
                grouped_questions=grouped_questions,
                question=message
            )
            faq.save()