from django.http import JsonResponse
from .models import Lesson
from .serializers import LessonSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['GET'])
def getLessons(request):
    lessons = Lesson.objects.all()
    serializer = LessonSerializer(lessons, many=True)
    return JsonResponse({"lessons:": serializer.data}, safe=False)

@api_view(['POST'])
def createLesson(request):
    serializer = LessonSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

