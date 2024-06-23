from rest_framework.viewsets import ModelViewSet

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
        # Convert message to lowercase for consistency
        message = message.lower()

        related_contents = RelatedContent.objects.filter(lesson_id=lesson_id)
        lesson = Lesson.objects.get(id=lesson_id)

        faqlist = Faq.objects.filter(lesson_id=lesson_id)
        max_sim_value = -1  # Initialize max similarity value
        most_similar_faq = None

        # Find the FAQ with the highest similarity to the new message
        for faq in faqlist:
            # Compute embeddings
            faq_embedding = model.encode(faq.question.lower())
            new_message_embedding = model.encode(message)
            cosine_sim = util.pytorch_cos_sim(new_message_embedding, faq_embedding).numpy()[0][0]

            if cosine_sim > max_sim_value:
                max_sim_value = cosine_sim
                most_similar_faq = faq

        # Threshold for similarity
        SIMILARITY_THRESHOLD = Teacher.objects.filter(id=1).first().threshold
        NOTIFICATION_THRESHOLD = Teacher.objects.filter(id=1).first().notification_threshold

        # Process based on similarity
        if max_sim_value >= SIMILARITY_THRESHOLD:
            matching_related_content = most_similar_faq.related_content if most_similar_faq else related_contents.first()
            grouped_questions = GroupedQuestions.objects.filter(
                lesson=lesson, related_content=matching_related_content, notified=False
            ).first()

            if not grouped_questions:
                grouped_questions = GroupedQuestions.objects.create(
                    related_content=matching_related_content,
                    lesson=lesson,
                )

            faq_count = Faq.objects.filter(
                related_content=matching_related_content, lesson=lesson, grouped_questions=grouped_questions
            ).count() + 1

            if faq_count >= NOTIFICATION_THRESHOLD:
                create_notification = Notification.objects.create(
                    lesson=lesson,
                    message="Message: Your lesson " + lesson.title + " as an AI suggestion based on FAQ's from students!"
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