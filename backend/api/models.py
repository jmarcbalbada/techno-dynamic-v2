from django.db import models

# Create your models here.

class Lesson(models.Model):
    title = models.CharField(max_length=50, default="", unique=True, null=False)
    url = models.URLField(max_length=255, null=True, blank=True)
    file = models.FileField(upload_to='media/', null=True, blank=True)

    def get_contents(self):
        return LessonContents.objects.filter(lesson=self)

    def __str__(self):
        return self.title

class LessonContents(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    contents = models.TextField(default="", null=False)

    def __str__(self):
        return self.contents