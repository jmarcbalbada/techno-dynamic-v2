from django.urls import path
from .views import lesson_view

urlpatterns = [
    path('lesson/', lesson_view),
]
