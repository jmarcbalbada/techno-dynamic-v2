
from django.db import models
from api.model.Lesson import Lesson
from api.model.ImageModel import ImageModel 

class LessonContent(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    contents = models.TextField(default="", null=False)
    url = models.URLField(max_length=255, null=True, blank=True)
    files = models.FileField(upload_to='media/', null=True, blank=True)
    images = models.ManyToManyField(ImageModel, related_name='lesson_contents', blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.contents

    def get_lesson_id(self):
        return self.lesson_id

    def set_lesson_id(self, lesson_id):
        self.lesson_id = lesson_id

    def get_contents(self):
        return self.contents

    def set_contents(self, contents):
        # Add delimiter
        delimiter = "<!-- delimiter -->"
        self.contents = contents + delimiter

    def get_url(self):
        return self.url

    def set_url(self, url):
        self.url = url

    def get_files(self):
        return self.files

    def set_file(self, files):
        self.files = files
