from django.db import models
from api.models import CustomUser
from .Lesson import Lesson
from .SubQuery import SubQuery

class Query(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    subqueries = models.ManyToManyField(SubQuery)
    context = models.TextField(blank=True, default='')

    def __str__(self):
        return f"Query for Lesson {self.lesson.lessonNumber} by {self.user.username}"

    def get_subqueries(self):
        return self.subqueries.all()

    def get_lesson(self):
        return self.lesson

    def get_user(self):
        return self.user

    def get_context(self):
        return self.context

    # Setters
    def set_lesson(self, lesson_instance):
        self.lesson = lesson_instance

    def set_user(self, user_instance):
        self.user = user_instance

    def add_subquery(self, subquery_instance):
        self.subqueries.add(subquery_instance)

    def remove_subquery(self, subquery_instance):
        self.subqueries.remove(subquery_instance)

    def set_context(self, context):
        self.context = context