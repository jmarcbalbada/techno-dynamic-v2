from django.http import JsonResponse
from .models import Lesson
from .serializers import LessonSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

# Create your views here.

class LessonsView(APIView):
    @staticmethod
    def get(request):
        lessons = Lesson.objects.all()
        serializer = LessonSerializer(lessons, many=True)
        return JsonResponse({"lessons:": serializer.data}, safe=False)

    @staticmethod
    def post(request):
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LessonDetailView(APIView):
    @staticmethod
    def get(request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        serializer = LessonSerializer(lesson)
        return Response(serializer.data)

    @staticmethod
    def put(request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        serializer = LessonSerializer(lesson, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def delete(request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        lesson.delete()
        return Response(f"Lesson {lesson_id} deleted successfully", status=status.HTTP_204_NO_CONTENT)
