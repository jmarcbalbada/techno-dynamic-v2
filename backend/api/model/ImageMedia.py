from django.db import models

class ImageMedia(models.Model):
    image_link = models.ImageField(upload_to='media')

    def __str__(self):
        return str(self.id)
