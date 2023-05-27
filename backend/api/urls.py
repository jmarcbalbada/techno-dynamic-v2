from django.urls import path
from .views import getLessons, createLesson

urlpatterns = [
    path('lessons/', getLessons),
    path('lessons/create/', createLesson),
]
