from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import status

from api.model.Lesson import Lesson
from api.serializer.LessonSerializer import LessonSerializer


class LessonController(GenericViewSet, ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def getAllLessons(self, request):
        instance = self.get_queryset()
        data = []
        for lesson in instance:
            data.append(LessonSerializer(lesson).data)
        return Response(data)

    def getLessonById(self, request, lesson_id):
        instance = self.get_queryset().filter(id=lesson_id).first()
        if instance is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(LessonSerializer(instance).data)

    def createLesson(self, request):
        data = request.data
        newLesson = Lesson()
        newLesson.set_title(data['title'])
        newLesson.set_subtitle(data['subtitle'])
        newLesson.set_cover_image(data['coverImage'])
        newLesson.save()
        return Response(LessonSerializer(newLesson).data)

    def updateLesson(self, request, lesson_id):
        data = request.data
        instance = self.get_queryset().filter(id=lesson_id).first()
        if instance is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
        instance.set_title(data['title'])
        instance.set_subtitle(data['subtitle'])
        instance.set_url(data['url'])
        instance.save()
        return Response(LessonSerializer(instance).data)

    def deleteLesson(self, request, lesson_id):
        instance = self.get_queryset().filter(id=lesson_id).first()
        if instance is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
        instance.delete()
        return Response({"success": "Lesson deleted"})
