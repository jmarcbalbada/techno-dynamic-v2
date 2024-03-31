from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from .model.Lesson import Lesson  # Adjust the import path here

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    STUDENT = 'student'
    TEACHER = 'teacher'

    ROLE_CHOICES = [
        (STUDENT, 'Student'),
        (TEACHER, 'Teacher'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=STUDENT)

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_full_name(self):
        return f"{self.first_name or ''} {self.last_name or ''}".strip()

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.username

class Faq(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='faqs')
    question = models.TextField()

    def __str__(self):
        return f"FAQ - Lesson {self.lesson.lessonNumber}: {self.question[:50]}"
    
    
class Suggestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    insights = models.TextField()
    content = models.TextField()
    old_content = models.TextField()

    def __str__(self):
        return f"Suggestion for Lesson {self.lesson.lessonNumber}"