from django.utils import timezone
from django.db import models
from api.model.Lesson import Lesson

class Notification(models.Model):
    notif_id = models.AutoField(primary_key=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_open = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Notification for Lesson {self.lesson.lessonNumber}: {self.message[:50]}"