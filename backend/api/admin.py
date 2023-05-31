from django.contrib import admin
from .model.Lesson import Lesson
from .model.LessonContent import LessonContent

# Register your models here.
admin.site.register(Lesson)
admin.site.register(LessonContent)