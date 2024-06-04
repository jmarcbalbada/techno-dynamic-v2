from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
# from api.model.Lesson import Lesson 

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
    opt_in = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_full_name(self):
        return f"{self.first_name or ''} {self.last_name or ''}".strip()

    def get_short_name(self):
        return self.first_name
    
    def get_opt_in(self):
        return self.opt_in
    
    def set_opt_in(self, new_opt_in):
        self.opt_in = new_opt_in
        self.save()  # Save the instance to update the database

    def __str__(self):
        return self.username
