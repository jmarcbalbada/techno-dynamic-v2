from django.shortcuts import render
from django.http import JsonResponse
from .models import Lesson
from .serializers import LessonSerializer

# Create your views here.

def lesson_view(request):
    lessons = Lesson.objects.all()
    serializer = LessonSerializer(lessons, many=True)
    return JsonResponse(serializer.data, safe=False)
