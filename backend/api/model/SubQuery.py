from django.db import models

class SubQuery(models.Model):
    question = models.TextField()
    response = models.TextField()

    def __str__(self):
        return f"SubQuery - Question: {self.question[:50]}"
