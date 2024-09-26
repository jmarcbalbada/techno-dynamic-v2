from django.db import models
from rest_framework.pagination import PageNumberPagination

from api.model.GroupedQuestions import GroupedQuestions
from api.model.Lesson import Lesson
from api.model.Notification import Notification
from api.model.RelatedContent import RelatedContent

class Faq(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='faqs')
    grouped_questions = models.ForeignKey(GroupedQuestions, on_delete=models.CASCADE, related_name='faqs',null=True)
    related_content = models.ForeignKey(RelatedContent, on_delete=models.CASCADE, related_name='faqs')
    question = models.TextField()


    def __str__(self):
        return f"FAQ - Lesson {self.lesson.lessonNumber}: {self.question[:50]}"


