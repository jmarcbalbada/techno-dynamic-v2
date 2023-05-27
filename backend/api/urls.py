from django.urls import path
from .views import LessonsView, LessonDetailView

urlpatterns = [
    path('lessons/', LessonsView.as_view()),
    path('lessons/<int:lesson_id>', LessonDetailView.as_view()),

]