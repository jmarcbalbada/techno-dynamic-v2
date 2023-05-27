from django.urls import path
from .views import viewLesson

urlpatterns = [
    path('lesson/', viewLesson),
]
