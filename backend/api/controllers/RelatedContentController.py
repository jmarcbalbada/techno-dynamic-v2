# from rest_framework.viewsets import ModelViewSet

from .FaqController import FaqController
from api.model.RelatedContent import  RelatedContent
from api.serializer.RelatedContentSerializer import  RelatedContentSerializer
from api.model.Faq import Faq
from api.model.Lesson import Lesson
from api.model.Teacher import Teacher
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from api.model.GroupedQuestions import GroupedQuestions
from api.model.Notification import Notification

import math
from collections import Counter


class RelatedContentController(ModelViewSet):
    queryset = RelatedContent.objects.all()
    serializer_class = RelatedContentSerializer

    @staticmethod
    def tokenize(text):
        # Split the text into words and remove non-alphanumeric characters
        return text.lower().split()

    @staticmethod
    def compute_word_frequencies(words):
        # Count the frequency of each word
        return Counter(words)

    @staticmethod
    def cosine_similarity(vec1, vec2):
        # Compute the dot product
        dot_product = sum(vec1[word] * vec2.get(word, 0) for word in vec1)

        # Compute the magnitude of each vector
        magnitude_vec1 = math.sqrt(sum(val ** 2 for val in vec1.values()))
        magnitude_vec2 = math.sqrt(sum(val ** 2 for val in vec2.values()))

        if not magnitude_vec1 or not magnitude_vec2:
            return 0.0

        # Compute cosine similarity
        return dot_product / (magnitude_vec1 * magnitude_vec2)

    @staticmethod
    def process_message_and_add_to_faq(lesson_id, message, similarity_threshold=0.3):
        """
        similarity_threshold: float, controls how flexible or strict the matching is.
        - 0.1: More flexible, groups contextually similar questions.
        - 1.0: High sensitivity, groups only exact matches.
        """

        # Convert message to lowercase and tokenize
        message_tokens = RelatedContentController.tokenize(message)

        related_contents = RelatedContent.objects.filter(lesson_id=lesson_id)
        lesson = Lesson.objects.get(id=lesson_id)

        faqlist = Faq.objects.filter(lesson_id=lesson_id)
        max_sim_value = -1  # Initialize max similarity value
        most_similar_faq = None

        # Find the FAQ with the highest similarity to the new message
        message_vector = RelatedContentController.compute_word_frequencies(message_tokens)

        for faq in faqlist:
            faq_tokens = RelatedContentController.tokenize(faq.question)
            faq_vector = RelatedContentController.compute_word_frequencies(faq_tokens)
            cosine_sim = RelatedContentController.cosine_similarity(message_vector, faq_vector)

            if cosine_sim > max_sim_value:
                max_sim_value = cosine_sim
                most_similar_faq = faq

        # Threshold for similarity
        similarity_threshold = Teacher.objects.filter(id=1).first().threshold
        if similarity_threshold > 0.4:
            similarity_threshold = 0.3
        SIMILARITY_THRESHOLD = similarity_threshold
        NOTIFICATION_THRESHOLD = Teacher.objects.filter(id=1).first().notification_threshold

        print("max_sim_value", max_sim_value)
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
                    message="Message: Your lesson " + lesson.title + " has an AI suggestion based on FAQs from students!"
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



# class RelatedContentController(ModelViewSet):
#     queryset = RelatedContent.objects.all()
#     serializer_class = RelatedContentSerializer

#     @staticmethod
#     def tokenize(text):
#         # Split the text into words and remove non-alphanumeric characters
#         return text.lower().split()

#     @staticmethod
#     def compute_word_frequencies(words):
#         # Count the frequency of each word
#         return Counter(words)

#     @staticmethod
#     def cosine_similarity(vec1, vec2):
#         # Compute the dot product
#         dot_product = sum(vec1[word] * vec2.get(word, 0) for word in vec1)

#         # Compute the magnitude of each vector
#         magnitude_vec1 = math.sqrt(sum(val ** 2 for val in vec1.values()))
#         magnitude_vec2 = math.sqrt(sum(val ** 2 for val in vec2.values()))

#         if not magnitude_vec1 or not magnitude_vec2:
#             return 0.0

#         # Compute cosine similarity
#         return dot_product / (magnitude_vec1 * magnitude_vec2)

#     @staticmethod
#     def process_message_and_add_to_faq(lesson_id, message):
#         # Convert message to lowercase and tokenize
#         message_tokens = RelatedContentController.tokenize(message)

#         related_contents = RelatedContent.objects.filter(lesson_id=lesson_id)
#         lesson = Lesson.objects.get(id=lesson_id)

#         faqlist = Faq.objects.filter(lesson_id=lesson_id)
#         max_sim_value = -1  # Initialize max similarity value
#         most_similar_faq = None

#         # Find the FAQ with the highest similarity to the new message
#         message_vector = RelatedContentController.compute_word_frequencies(message_tokens)

#         for faq in faqlist:
#             faq_tokens = RelatedContentController.tokenize(faq.question)
#             faq_vector = RelatedContentController.compute_word_frequencies(faq_tokens)
#             cosine_sim = RelatedContentController.cosine_similarity(message_vector, faq_vector)

#             if cosine_sim > max_sim_value:
#                 max_sim_value = cosine_sim
#                 most_similar_faq = faq

#         # Threshold for similarity
#         SIMILARITY_THRESHOLD = 0.1
#         NOTIFICATION_THRESHOLD = Teacher.objects.filter(id=1).first().notification_threshold

#         print("max_sim_value", max_sim_value)
#         # Process based on similarity
#         if max_sim_value >= SIMILARITY_THRESHOLD:
#             matching_related_content = most_similar_faq.related_content if most_similar_faq else related_contents.first()
#             grouped_questions = GroupedQuestions.objects.filter(
#                 lesson=lesson, related_content=matching_related_content, notified=False
#             ).first()

#             if not grouped_questions:
#                 grouped_questions = GroupedQuestions.objects.create(
#                     related_content=matching_related_content,
#                     lesson=lesson,
#                 )

#             faq_count = Faq.objects.filter(
#                 related_content=matching_related_content, lesson=lesson, grouped_questions=grouped_questions
#             ).count() + 1

#             if faq_count >= NOTIFICATION_THRESHOLD:
#                 create_notification = Notification.objects.create(
#                     lesson=lesson,
#                     message="Message: Your lesson " + lesson.title + " has an AI suggestion based on FAQs from students!"
#                 )
#                 grouped_questions.notification = create_notification
#                 grouped_questions.notified = True
#                 grouped_questions.save()

#             faq = Faq.objects.create(
#                 lesson=lesson,
#                 related_content=matching_related_content,
#                 grouped_questions=grouped_questions,
#                 question=message
#             )
#             faq.save()
#         else:
#             new_related_content = RelatedContent.objects.create(
#                 lesson=lesson,
#                 general_context=message
#             )
#             grouped_questions = GroupedQuestions.objects.create(
#                 related_content=new_related_content,
#                 lesson=lesson,
#             )
#             faq = Faq.objects.create(
#                 lesson=lesson,
#                 related_content=new_related_content,
#                 grouped_questions=grouped_questions,
#                 question=message
#             )
#             faq.save()
