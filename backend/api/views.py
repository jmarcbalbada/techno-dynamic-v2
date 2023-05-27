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

@api_view(['GET'])
def getLessonById(request, lesson_id):
    lesson = checkLessonIfExist(lesson_id)
    serializer = LessonSerializer(lesson)
    return Response(serializer.data)

@api_view(['POST'])
def createLesson(request):
    serializer = LessonSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def updateLesson(request, lesson_id):
    lesson = checkLessonIfExist(lesson_id)
    serializer = LessonSerializer(lesson, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def deleteLesson(request, lesson_id):
    lesson = checkLessonIfExist(lesson_id)
    lesson.delete()
    return Response("Lesson deleted successfully", status=status.HTTP_204_NO_CONTENT)

def checkLessonIfExist(lesson_id):
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    return lesson