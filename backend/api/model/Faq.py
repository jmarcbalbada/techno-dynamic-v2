from django.db import models
from rest_framework.pagination import PageNumberPagination

from api.model.Lesson import Lesson
from api.model.Notification import Notification
from api.model.RelatedContent import RelatedContent

class Faq(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='faqs')
    related_content = models.ForeignKey(RelatedContent, on_delete=models.CASCADE, related_name='faqs')
    question = models.TextField()


    def __str__(self):
        return f"FAQ - Lesson {self.lesson.lessonNumber}: {self.question[:50]}"
    
    # override save
    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)
    #     print("\n\nsaved")
    #     # After saving the FAQ, count the total number of individual questions for the lesson
    #     total_questions = 0
    #     i = 0
    #     faqs = Faq.objects.filter(lesson=self.lesson)
    #     for faq in faqs:
    #         questions = faq.question.split('\n')
    #         print("\nquestion :", i, " = ", questions, "\n")
    #         i = i + 1
    #         question_count = len([q for q in questions if q.strip() != ''])
    #         total_questions += question_count
    #     print("\n\nTotal questions", total_questions)
    #     if total_questions >= 10:
    #         # Check if a notification for reaching 10 questions has already been created to avoid duplicates
    #         existing_notifications = Notification.objects.filter(
    #             lesson=self.lesson,
    #             message__icontains="lesson has an AI content suggestion based on FAQ's from students!"
    #         )
    #         if not existing_notifications.exists():
    #             # Create a notification if the total question count reaches 10
    #             message = f"Your \"{self.lesson.title}\" lesson has an AI content suggestion based on FAQ's from students!"
    #             Notification.objects.create(
    #                 lesson=self.lesson,
    #                 message=message,
    #                 is_read=False,
    #                 date_created=timezone.now()
    #             )

            # create a suggestion after implementing notification

