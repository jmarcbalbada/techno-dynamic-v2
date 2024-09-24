from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
import re

from api.model.LessonContent import LessonContent
from api.serializer.LessonContentSerializer import LessonContentSerializer
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
        new_lesson_content.set_file(request.FILES.get('files'))
        new_lesson_content.save()
        serializer = LessonContentSerializer(new_lesson_content)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def updateLessonContents(self, request, lesson_contents_id, lesson_id):
        data = request.data

        instance = self.get_queryset().filter(id=lesson_contents_id, lesson_id=lesson_id).first()

        if instance is None:
            return Response({"error": "Lesson contents not found"}, status=status.HTTP_404_NOT_FOUND)

        instance.contents = data['contents'] + "<!-- delimiter -->"
        instance.files = request.FILES.get('files')
        instance.save()
        serializer = LessonContentSerializer(instance)

        return Response(serializer.data)

    def patchLessonContents(self, request, lesson_contents_id=None, lesson_id=None):
        lesson_content = self.get_queryset().filter(id=lesson_contents_id, lesson_id=lesson_id).first()
        if lesson_content is None:
            return Response({"error": "Lesson content not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data

        if 'contents' in data:
            lesson_content.set_contents(data['contents'])
        if 'url' in data:
            lesson_content.set_url(data['url'])
        if 'files' in request.FILES:
            lesson_content.set_file(request.FILES['files'])

        lesson_content.save()
        return Response(LessonContentSerializer(lesson_content).data)

    def deleteLessonContents(self, request, lesson_contents_id, lesson_id):
        instance = self.get_queryset().filter(id=lesson_contents_id, lesson_id=lesson_id).first()

        if instance is None:
            return Response({"error": "Lesson contents not found"}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()

        return Response({"success": "Lesson contents deleted"})

    # helper
    # returns tuple : [0] - lenOfPages [1] - arr of contents
    @staticmethod
    def split_content_by_delimiter(content: str, isRevert: bool = False):
        # Define the delimiter pattern
        delimiter_pattern = r"<!-- delimiter -->"
        
        # Split the content by delimiter
        page_contents = re.split(delimiter_pattern, content)
        
        # Add the delimiter back to the non-final parts
        page_contents = [part + "<!-- delimiter -->" for part in page_contents[:-1]] + [page_contents[-1]]
        
        # Check if it's a revert action, remove the last page if it's empty
        if isRevert and page_contents[-1].strip() == '':
            page_contents.pop()  # Remove the last empty page

        # Count the number of pages
        num_pages = len(page_contents)

        return num_pages, page_contents

    
    @staticmethod
    def getAllContentsHelper(lesson_id):
        contents = LessonContent.objects.filter(lesson_id=lesson_id)

        if contents is None:
            return None
        
        return contents