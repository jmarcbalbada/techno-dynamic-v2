from django.urls import path
from .views import LessonView

urlpatterns = [
    path('lesson', LessonView.as_view()),
]
