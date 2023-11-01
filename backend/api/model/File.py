from django.db import models

class FileMedia(models.Model):
    file = models.FileField(upload_to='files')

    def __str__(self):
        return str(self.id)
