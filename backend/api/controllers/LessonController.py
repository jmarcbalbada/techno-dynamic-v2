from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from api.model.Lesson import Lesson
from api.model.LessonContent import LessonContent
from api.serializer.LessonSerializer import LessonSerializer
from api.serializer.LessonContentSerializer import LessonContentSerializer
from api.controllers.permissions.permissions import IsTeacher


class LessonController(GenericViewSet, ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_permissions(self):
        if self.action in ['createLesson', 'updateLesson', 'deleteLesson']:
            return [IsAuthenticated(), IsTeacher()]
        else:
            return [IsAuthenticated()]

    def getAllLessons(self, request):
        lessons = self.get_queryset().order_by('lessonNumber')  # Sort lessons by lessonNumber
        data = []

        for lesson in lessons:
            lesson_data = LessonSerializer(lesson).data
            lesson_contents = LessonContent.objects.filter(lesson=lesson)
            lesson_contents_data = LessonContentSerializer(lesson_contents, many=True).data
            lesson_data['pages'] = lesson_contents_data
            data.append(lesson_data)

        return Response(data)

    def getLessonById(self, request, lesson_id):
        lesson = self.get_queryset().filter(id=lesson_id).first()

        if lesson is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        lesson_data = LessonSerializer(lesson).data
        lesson_contents = LessonContent.objects.filter(lesson=lesson)
        lesson_contents_data = LessonContentSerializer(lesson_contents, many=True).data
        lesson_data['pages'] = lesson_contents_data

        return Response(lesson_data)

    def createLesson(self, request):
        data = request.data

        newLesson = Lesson()
        newLesson.set_lesson_number(data['lessonNumber'])
        newLesson.set_title(data['title'])
        newLesson.set_subtitle(data['subtitle'])
        newLesson.set_cover_image(data.get('coverImage', None))
        newLesson.save()

        # Create LessonContents for each page
        if 'pages' in data:
            pages_data = data['pages']
            lesson_contents = []
            for page_data in pages_data:
                page_contents = page_data.get('contents', '')
                page_url = page_data.get('url', None)
                page_files = page_data.get('files', None)

                new_page = LessonContent(
                    lesson=newLesson,
                    contents=page_contents,
                    url=page_url,
                    files=page_files
                )
                new_page.save()
                lesson_contents.append(new_page)

        lesson_data = LessonSerializer(newLesson).data
        lesson_data['pages'] = LessonContentSerializer(lesson_contents, many=True).data

        return Response(lesson_data)

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

    def patchLesson(self, request, lesson_id=None):
        lesson = self.get_queryset().filter(id=lesson_id).first()
        if lesson is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data

        if 'title' in data:
            lesson.set_title(data['title'])
        if 'subtitle' in data:
            lesson.set_subtitle(data['subtitle'])
        if 'coverImage' in data:
            lesson.set_cover_image(data['coverImage'])

        lesson.save()
        return Response(LessonSerializer(lesson).data)

    def deleteLesson(self, request, lesson_id):
        instance = self.get_queryset().filter(id=lesson_id).first()

        if instance is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()

        return Response({"success": "Lesson deleted"})
