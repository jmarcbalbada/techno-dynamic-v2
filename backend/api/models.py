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

class Faq(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='faqs')
    question = models.TextField()

    def __str__(self):
        return f"FAQ - Lesson {self.lesson.lessonNumber}: {self.question[:50]}"
    
    # override save
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        print("\n\nsaved")
        # After saving the FAQ, count the total number of individual questions for the lesson
        total_questions = 0
        i = 0
        faqs = Faq.objects.filter(lesson=self.lesson)
        for faq in faqs:
            questions = faq.question.split('\n')
            print("\nquestion :", i, " = ", questions, "\n")
            i = i + 1
            question_count = len([q for q in questions if q.strip() != ''])
            total_questions += question_count
        print("\n\nTotal questions", total_questions)
        if total_questions >= 10:
            # Check if a notification for reaching 10 questions has already been created to avoid duplicates
            existing_notifications = Notification.objects.filter(
                lesson=self.lesson,
                message__icontains="lesson has an AI content suggestion based on FAQ's from students!"
            )
            if not existing_notifications.exists():
                # Create a notification if the total question count reaches 10
                message = f"Your \"{self.lesson.title}\" lesson has an AI content suggestion based on FAQ's from students!"
                Notification.objects.create(
                    lesson=self.lesson,
                    message=message,
                    is_read=False,
                    date_created=timezone.now()
                )

            # create a suggestion after implementing notification
    
class Suggestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    insights = models.TextField()
    content = models.TextField()
    old_content = models.TextField()

    def __str__(self):
        return f"Suggestion for Lesson {self.lesson.lessonNumber}"
    

class Notification(models.Model):
    notif_id = models.AutoField(primary_key=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Notification for Lesson {self.lesson.lessonNumber}: {self.message[:50]}"