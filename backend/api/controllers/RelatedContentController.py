from rest_framework.viewsets import ModelViewSet

from .NoticeNotifierController import NoticeNotifierController
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
# Load the pre-trained model
warnings.filterwarnings("ignore", category=FutureWarning, module="huggingface_hub.file_download")

model = SentenceTransformer('all-MiniLM-L6-v2')

class RelatedContentController(ModelViewSet):
    queryset = RelatedContent.objects.all()
    serializer_class = RelatedContentSerializer

    def process_message_and_add_to_faq( lesson_id, message):
        # Retrieve related content for the specific lesson
        related_contents = RelatedContent.objects.filter(lesson_id=lesson_id)
        lesson = Lesson.objects.get(id=lesson_id)

        if not related_contents:
            # If there are no related content entries, create a new one directly
            new_related_content = RelatedContent.objects.create(
                lesson=lesson,
                general_context=message
            )
            Faq.objects.create(
                lesson=lesson,
                related_content=new_related_content,
                question=message
            )
            # return f"New related content created and message added to FAQ under related content ID {new_related_content.id}"

        # Prepare the general contexts and the message for comparison
        contexts = [rc.general_context for rc in related_contents]
        contexts.append(message)

        # Compute embeddings
        message_embeddings = model.encode(contexts)
        new_message_embedding = message_embeddings[-1]
        existing_message_embeddings = message_embeddings[:-1]

        # Calculate cosine similarity between the new message and each existing message
        cosine_sim = util.pytorch_cos_sim(new_message_embedding, existing_message_embeddings).numpy()
        max_sim_index = int(np.argmax(cosine_sim))
        max_sim_value = np.max(cosine_sim)

        # Threshold for similarity


        #TODO tobe updated not good practice
        threshold = Teacher.objects.filter(id=1).first().threshold
        print("Threshold for similarity",threshold)
        SIMILARITY_THRESHOLD = threshold

        if max_sim_value >= SIMILARITY_THRESHOLD:
            matching_related_content = related_contents[max_sim_index]
            # Add the message to FAQ
            faq = Faq.objects.create(
                lesson=lesson,
                related_content=matching_related_content,
                question=message
            )
            faq.save()
            NoticeNotifierController.create_notice(lesson_id, related_contents[max_sim_index].related_content_id)
            # return f"Message added to FAQ under related content ID {matching_related_content.id}"
        else:
            # If no similar content is found, create a new RelatedContent
            new_related_content = RelatedContent.objects.create(
                lesson=lesson,
                general_context=message
            )
            faq = Faq.objects.create(
                lesson=lesson,
                related_content=new_related_content,
                question=message
            )
            faq.save()
            NoticeNotifierController.create_notice(lesson_id, related_contents[max_sim_index].related_content_id)
            # return f"New related content created and message added to FAQ under related content ID {new_related_content.id}"