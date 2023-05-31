from django.http import JsonResponse
from .models import Lesson, LessonContents
from .serializers import LessonSerializer, LessonContentsSerializer
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
        response_data = []
        for lesson in serializer.data:
            lesson_instance = Lesson.objects.get(pk=lesson['id'])
            contents_serializer = LessonContentsSerializer(lesson_instance.get_contents(), many=True)
            lesson['pages'] = contents_serializer.data
            response_data.append(lesson)
        return Response(response_data, status=status.HTTP_200_OK)

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
        lesson_serializer = LessonSerializer(lesson)
        contents_serializer = LessonContentsSerializer(lesson.get_contents(), many=True)
        response_data = {
            'lesson': lesson_serializer.data,
            'pages': contents_serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)

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


class LessonContentsView(APIView):
    @staticmethod
    def get(request, lesson_id):
        lesson_contents = LessonContents.objects.filter(lesson_id=lesson_id)
        serializer = LessonContentsSerializer(lesson_contents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def post(request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        serializer = LessonContentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(lesson=lesson)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LessonContentsDetailView(APIView):
    @staticmethod
    def get(request, lesson_id, lesson_contents_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        lesson_contents = get_object_or_404(LessonContents, pk=lesson_contents_id, lesson=lesson)
        serializer = LessonContentsSerializer(lesson_contents)
        return Response(serializer.data, status=status.HTTP_200_OK)
