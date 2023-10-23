from django.db import models

class ImageModel(models.Model):
    lesson_content = models.ForeignKey('api.LessonContent', on_delete=models.CASCADE)
    image_link = models.ImageField(upload_to='media')

    def __str__(self):
        return str(self.id)
