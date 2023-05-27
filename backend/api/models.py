from django.db import models
import uuid

# Create your models here.
class Lesson(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50, default="", unique=True, null=False)
    content = models.CharField(max_length=5000, default="", null=False)
