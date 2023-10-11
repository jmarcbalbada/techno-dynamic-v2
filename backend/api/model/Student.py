from django.db import models
from ..models import CustomUser as User

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')

    COURSE_CHOICES = [
        ('BS Computer Science', 'BS Computer Science'),
        ('BS Information Technology', 'BS Information Technology'),
    ]
    YEAR_CHOICES = [
        ('1st Year', '1st Year'),
        ('2nd Year', '2nd Year'),
        ('3rd Year', '3rd Year'),
        ('4th Year', '4th Year'),
    ]
    course = models.CharField(max_length=50, choices=COURSE_CHOICES)
    year = models.CharField(max_length=10, choices=YEAR_CHOICES)

    def __str__(self):
        return self.user.username  # You can customize this as needed.
