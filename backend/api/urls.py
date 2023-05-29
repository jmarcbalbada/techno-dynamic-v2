from django.urls import path
from .views import LessonsView, LessonDetailView, LessonContentsView, LessonContentsDetailView

urlpatterns = [
    path('lessons/', LessonsView.as_view()),
    path('lessons/<int:lesson_id>', LessonDetailView.as_view()),
    path('lessons/<int:lesson_id>/contents/', LessonContentsView.as_view()),
    path('lessons/<int:lesson_id>/contents/<int:lesson_contents_id>', LessonContentsDetailView.as_view())
]