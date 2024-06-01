from django.utils import timezone
from ..models import CustomUser as User
from django.db import models

class TeacherProfile(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
  # allow to teacher to receive a insights and suggestions
  # the backend will make a processes for (Chatbot COntroller)
  allow_insight_suggestion = models.BooleanField(default=True,null=False)
  similiarity_threshold =models.IntegerField(default=0.7, null=False)

  def __str__(self):
    return self.user.username  # You can customize this as needed.
