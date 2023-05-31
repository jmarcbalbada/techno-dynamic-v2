from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework import status

from api.models import Lesson
from api.serializers import LessonSerializer


class LessonController(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    @action(methods=['GET'], detail=False)
    def getAllLessons(self, request):
        instance = self.get_queryset()
        data = []
        for lesson in instance:
            data.append(LessonSerializer(lesson).data)
        return Response(data)

    @action(methods=['GET'], detail=True)
    def getLessonById(self, request, id):
        instance = self.get_queryset().filter(id=id).first()
        if instance is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(LessonSerializer(instance).data)

    @action(methods=['POST'], detail=False)
    def createLesson(self, request):
        data = request.data
        newLesson = Lesson()
        newLesson.set_title(data['title'])
        newLesson.set_subtitle(data['subtitle'])
        newLesson.set_url(data['url'])
        newLesson.save()
        return Response(LessonSerializer(newLesson).data)

    @action(methods=['PUT'], detail=True)
    def updateLesson(self, request, id):
        data = request.data
        instance = self.get_queryset().filter(id=id).first()
        if instance is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
        instance.set_title(data['title'])
        instance.set_subtitle(data['subtitle'])
        instance.set_url(data['url'])
        instance.save()
        return Response(LessonSerializer(instance).data)

    @action(methods=['DELETE'], detail=True)
    def deleteLesson(self, request, id):
        instance = self.get_queryset().filter(id=id).first()
        if instance is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
        instance.delete()
        return Response({"success": "Lesson deleted"})
