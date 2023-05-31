from django.db import models
from api.model.Lessons import Lessons


class LessonContent(models.Model):
    lessonId = models.ForeignKey(Lessons, on_delete=models.CASCADE)
    contents = models.TextField(default="", null=False)
    url = models.URLField(max_length=255, null=True, blank=True)
    files = models.FileField(upload_to='media/', null=True, blank=True)

    def get_lessonid(self):
        return self.lessonId
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


