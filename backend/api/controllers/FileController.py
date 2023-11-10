import json
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from api.model.File import File
from api.model.Lesson import Lesson  # Update this import to match the location of your models
from api.serializer.FileSerializer import FileSerializer

class FileController(GenericViewSet, ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def getAllFile(self, request):
        file_media = File.objects.all()
        serializer = self.get_serializer(file_media, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def getAllFileByLessonId(self, request, lesson_id):
        files = File.objects.filter(lesson=lesson_id)
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)

    def createFile(self, request, lesson_id):
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Modify the serializer to handle multiple files
        data = request.data.copy()
        data['lesson'] = lesson_id
        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def updateFile(self, request, pk):
        instance = File.objects.filter(id=pk).first()

        if instance is None:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        # Include lesson_id in the request data if it's provided
        lesson_id = request.data.get('lesson_id', None)
        if lesson_id is not None:
            try:
                lesson = Lesson.objects.get(pk=lesson_id)
            except Lesson.DoesNotExist:
                return Response({"error": "Lesson not found"}, status=status.HTTP_400_BAD_REQUEST)
            request.data['lesson'] = lesson_id

        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def deleteFile(self, request, pk):
        instance = File.objects.all().filter(id=pk).first()

        if instance is None:
            return Response({"error": "File Media not found"}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({"success": "File Media deleted"})
