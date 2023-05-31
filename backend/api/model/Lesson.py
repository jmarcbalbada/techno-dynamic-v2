from django.db import models

class Lesson(models.Model):
    title = models.CharField(max_length=50, default="", null=False)
    subtitle = models.CharField(max_length=50, default="", null=False)
    coverImage = models.ImageField(blank=True, upload_to='media/')
    url = models.URLField(max_length=255, null=True, blank=True)
    pages = []

    def get_title(self):
        return self.title

    def set_title(self, title):
        self.title = title

    def get_subtitle(self):
        return self.subtitle

    def set_subtitle(self, subtitle):
        self.subtitle = subtitle

    def get_url(self):
        return self.url

    def set_url(self, url):
        self.url = url

    def get_pages(self):
        return self.pages

    def set_lesson_content(self, pages):
        self.pages.append(pages)

    def get_cover_image(self):
        return self.coverImage

    def set_cover_image(self, cover_image):
        self.coverImage = cover_image

