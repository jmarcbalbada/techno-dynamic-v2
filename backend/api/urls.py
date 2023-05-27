from django.urls import path
from .views import getLessons, createLesson, getLessonById

urlpatterns = [
    path('lessons/', getLessons),
    path('lessons/create/', createLesson),
    path('lessons/<int:lesson_id>', getLessonById)
]
