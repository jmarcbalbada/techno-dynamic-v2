from django.db import models
from api.model.Lesson import Lesson

class Suggestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    insights = models.TextField()
    content = models.TextField()
    old_content = models.TextField()

    def __str__(self):
        return f"Suggestion for Lesson {self.lesson.lessonNumber}"
    