from django.shortcuts import render
from django.http import JsonResponse
from .models import Lesson
from .serializers import LessonSerializer

# Create your views here.

def viewLesson(request):
    lessons = Lesson.objects.all()
    serializer = LessonSerializer(lessons, many=True)
    return JsonResponse({"lessons:": serializer.data}, safe=False)
