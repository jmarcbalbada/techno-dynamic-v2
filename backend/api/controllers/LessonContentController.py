from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework import status

from api.models import LessonContents
from api.serializers import LessonContentsSerializer


class LessonContentsController(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    queryset = LessonContents.objects.all()
    serializer_class = LessonContentsSerializer

    @action(methods=['GET'], detail=False)
    def getAllLessonContents(self, request):
        instance = self.get_queryset()
        data = []
        for lesson_content in instance:
            data.append(LessonContentsSerializer(lesson_content).data)
        return Response(data)

    @action(methods=['GET'], detail=True)
    def getLessonContentsById(self, request, id):
        instance = self.get_queryset().filter(id=id).first()
        if instance is None:
            return Response({"error": "Lesson contents not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(LessonContentsSerializer(instance).data)

    @action(methods=['POST'], detail=False)
    def createLessonContents(self, request):
        data = request.data
        new_lesson_contents = LessonContents()
        new_lesson_contents.lessonId_id = data['lessonId']
        new_lesson_contents.set_contents(data['contents'])
        new_lesson_contents.set_file(request.FILES.get('files'))
        new_lesson_contents.save()
        return Response(LessonContentsSerializer(new_lesson_contents).data)

    @action(methods=['PUT'], detail=True)
    def updateLessonContents(self, request, id):
        data = request.data
        instance = self.get_queryset().filter(id=id).first()
        if instance is None:
            return Response({"error": "Lesson contents not found"}, status=status.HTTP_404_NOT_FOUND)
        instance.set_contents(data['contents'])
        instance.set_file(request.FILES.get('files'))
        instance.save()
        return Response(LessonContentsSerializer(instance).data)

    @action(methods=['DELETE'], detail=True)
    def deleteLessonContents(self, request, id):
        instance = self.get_queryset().filter(id=id).first()
        if instance is None:
            return Response({"error": "Lesson contents not found"}, status=status.HTTP_404_NOT_FOUND)
        instance.delete()
        return Response({"success": "Lesson contents deleted"})
