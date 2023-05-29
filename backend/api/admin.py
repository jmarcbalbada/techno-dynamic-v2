from django.contrib import admin
from .models import Lesson, LessonContents

# Register your models here.
admin.site.register(Lesson)
admin.site.register(LessonContents)