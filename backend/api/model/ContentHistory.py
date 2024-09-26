from django.db import models
from django.utils import timezone
from api.model.Lesson import Lesson 

class ContentHistory(models.Model):
    historyId = models.AutoField(primary_key=True)
    lessonId = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='lesson_id') 
    content = models.TextField()  
    version = models.IntegerField(default=1)
    updatedAt = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = 'Content History'
        verbose_name_plural = 'Content Histories'

    def __str__(self):
        return f"Lesson ID: {self.lessonId.id}, Version: {self.version}"

    # Getter for lessonId
    def get_lesson_id(self):
        return self.lessonId

    # Setter for lessonId
    def set_lesson_id(self, new_lesson_id):
        self.lessonId = new_lesson_id
        self.save()

    # Getter for content
    def get_content(self):
        return self.content

    # Setter for content
    def set_content(self, new_content):
        self.content = new_content
        self.updatedAt = timezone.now()  # Update the timestamp when content is changed
        self.save()

    # Getter for version
    def get_version(self):
        return self.version

    # Setter for version
    def set_version(self, new_version):
        self.version = new_version
        self.save()

    # Getter for updatedAt
    def get_updated_at(self):
        return self.updatedAt
