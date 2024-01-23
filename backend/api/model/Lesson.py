from django.db import models
from api.model.File import File

class Lesson(models.Model):
    lessonNumber = models.IntegerField(unique=True, null=False)
    title = models.CharField(max_length=100, default="", null=False)
    subtitle = models.CharField(max_length=300, default="", null=False)
    coverImage = models.ImageField(blank=True, upload_to='media/')
    files = models.ManyToManyField(File, related_name='lessons', blank=True)

    def __str__(self):
        return self.title + ' ' + self.subtitle

    def get_id(self):
        return self.id

    def get_lesson_number(self):
        return self.lessonNumber

    def set_lesson_number(self, lesson_number):
        self.lessonNumber = lesson_number

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

    def get_files(self):
        return self.files.all()  # Returns all associated files for the lesson

    def set_files(self, file_data):
        # Add or associate files with the lesson
        for file in file_data:
            file_item, created = File.objects.get_or_create(file=file)
            self.files.add(file_item)