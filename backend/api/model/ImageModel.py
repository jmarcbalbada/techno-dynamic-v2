from django.db import models

class ImageModel(models.Model):
    id = models.AutoField(primary_key=True)  # Automatically generated unique ID
    imageLink = models.ImageField(upload_to='media/')

    def __str__(self):
        return str(self.id)  # Convert id to a string for representation
