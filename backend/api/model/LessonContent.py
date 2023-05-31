from django.db import models
from api.model.Lesson import Lesson


class LessonContent(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    contents = models.TextField(default="", null=False)
    url = models.URLField(max_length=255, null=True, blank=True)
    files = models.FileField(upload_to='media/', null=True, blank=True)

    def __str__(self):
        return self.contents

    def get_lesson_id(self):
        return self.lesson

    def get_contents(self):
        return self.contents

    def get_files(self):
        return self.files

    def get_url(self):
        return self.url

    def set_url(self, url):
        self.url = url

    def set_contents(self, contents):
        self.contents = contents

    def get_file(self):
        return self.files

    def set_file(self, files):
        self.files = files


