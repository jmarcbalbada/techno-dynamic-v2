from django.db import models

# Create your models here.
class Lesson(models.Model):
    title = models.CharField(max_length=50, default="", unique=True, null=False)
    content = models.CharField(max_length=5000, default="", null=False)

    def __str__(self):
        return self.title + ' ' + self.content
