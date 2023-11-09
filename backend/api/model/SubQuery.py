from django.utils import timezone

from django.db import models

class SubQuery(models.Model):
    question = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"SubQuery - Question: {self.question[:50]}"
