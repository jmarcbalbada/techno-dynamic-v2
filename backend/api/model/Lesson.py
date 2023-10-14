from django.db import models

class Lesson(models.Model):
    lessonNumber = models.IntegerField(unique=True, null=False)
    title = models.CharField(max_length=50, default="", null=False)
    subtitle = models.CharField(max_length=50, default="", null=False)
    coverImage = models.ImageField(blank=True, upload_to='media/')

    def __str__(self):
        return self.title + ' ' + self.subtitle

    def get_title(self):
        return self.title

    def set_title(self, title):
        self.title = title

    def get_subtitle(self):
        return self.subtitle

    def set_subtitle(self, subtitle):
        self.subtitle = subtitle

    def get_cover_image(self):
        return self.coverImage

    def set_cover_image(self, cover_image):
        self.coverImage = cover_image

