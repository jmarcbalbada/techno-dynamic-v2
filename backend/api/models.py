from django.db import models

# Create your models here.

class Lesson(models.Model):
    title = models.CharField(max_length=50, default="", unique=True, null=False)
    content = models.CharField(max_length=5000, default="", null=False)
    url = models.URLField(max_length=255, null=True, blank=True)
    file = models.FileField(upload_to='media/', null=True, blank=True)

    def __str__(self):
        return self.title + ' ' + self.content
