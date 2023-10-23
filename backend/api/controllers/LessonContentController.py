from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import (
    ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin
)
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from api.model.LessonContent import LessonContent
from api.model.ImageModel import ImageModel  # Import the ImageModel
from api.serializer.LessonContentSerializer import LessonContentSerializer
from api.serializer.ImageModelSerializer import ImageModelSerializer  # Import the ImageModelSerializer
from api.controllers.permissions.permissions import IsTeacher

class LessonContentsController(GenericViewSet, ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin):
    queryset = LessonContent.objects.all()
    serializer_class = LessonContentSerializer

    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_permissions(self):
        if self.action in ['createLessonContents', 'updateLessonContents', 'deleteLessonContents']:
            return [IsAuthenticated(), IsTeacher()]
        else:
            return [IsAuthenticated()]

    def getAllLessonContents(self, request, lesson_id):
        instance = self.get_queryset().filter(lesson_id=lesson_id)
        serializer = self.get_serializer(instance, many=True)

        return Response(serializer.data)

    def getLessonContentsById(self, request, lesson_contents_id, lesson_id):
        instance = self.get_queryset().filter(lesson_id=lesson_id, id=lesson_contents_id).first()

        if instance is None:
            return Response({"error": "Lesson contents not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance)

        return Response(serializer.data)

    def createLessonContents(self, request, lesson_id):
        data = request.data

        new_lesson_content = LessonContent()
        new_lesson_content.set_lesson_id(lesson_id)
        new_lesson_content.set_contents(data['contents'])
        new_lesson_content.set_url(data['url'])
        new_lesson_content.save()
        
        # Handle image upload and association with the lesson content
        if 'files' in request.FILES:
            image = ImageModel(imageLink=request.FILES['files'])
            image.save()
            new_lesson_content.image = image  # Assuming LessonContent has a ForeignKey to ImageModel
            new_lesson_content.save()

        serializer = LessonContentSerializer(new_lesson_content)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def updateLessonContents(self, request, lesson_contents_id, lesson_id):
        data = request.data

        instance = self.get_queryset().filter(id=lesson_contents_id, lesson_id=lesson_id).first()

        if instance is None:
            return Response({"error": "Lesson contents not found"}, status=status.HTTP_404_NOT_FOUND)

        instance.contents = data['contents']
        instance.url = data['url']
        instance.save()
        
        # Update the associated image
        if 'files' in request.FILES:
            instance.image.imageLink = request.FILES['files']
            instance.image.save()

        serializer = LessonContentSerializer(instance)

        return Response(serializer.data)

    # ... Other methods remain the same ...
