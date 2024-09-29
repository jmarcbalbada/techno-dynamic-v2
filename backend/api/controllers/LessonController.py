from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from api.model.Notification import Notification
import json

from api.model.Lesson import Lesson
from api.model.LessonContent import LessonContent
from api.model.File import File
from api.serializer import FileSerializer
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
        lessons = self.get_queryset().order_by('lessonNumber')  #Sort lessons by lessonNumber
        data = []

        for lesson in lessons:
            lesson_data = LessonSerializer(lesson).data
            lesson_contents = LessonContent.objects.filter(lesson=lesson).order_by('id')
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

    @action(detail=False, methods=['GET'])
    def findLessonbyLessonNumber(self, request):
        lesson_number = request.query_params.get('lessonNumber')

        if lesson_number is None:
            return Response({"error": "lessonNumber parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lesson = Lesson.objects.get(lessonNumber=lesson_number)
        except Lesson.DoesNotExist:
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

        lesson_files_data = []
        lesson_contents = []

        # Associate files with the lesson if available
        if 'lesson_files' in request.FILES:
            files_data = request.FILES.getlist('lesson_files')
            for uploaded_file in files_data:
                file_serializer = FileSerializer(data={'file': uploaded_file, 'lesson': newLesson.get_id()})
                if file_serializer.is_valid():
                    file_serializer.save()
                    lesson_files_data.append(file_serializer.data)

        # Create LessonContents for each page
        if 'pages' in data:
            pages_data = json.loads(data['pages'])

            for page_data in pages_data:
                page_contents = page_data.get('contents', '')
                page_url = page_data.get('url', None)

                new_page = LessonContent()
                new_page.set_lesson_id(newLesson.id)
                new_page.set_contents(page_contents)
                new_page.set_url(page_url)
                new_page.save()
                lesson_contents.append(new_page)

        # Fetch associated files after they are added to the lesson
        lesson_data = LessonSerializer(newLesson).data
        lesson_data['lesson_files'] = lesson_files_data
        lesson_data['pages'] = LessonContentSerializer(lesson_contents, many=True).data

        return Response(lesson_data)


    def updateLesson(self, request, lesson_id):
        instance = self.get_queryset().filter(id=lesson_id).first()

        if instance is None:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve form data fields
        lesson_data = {
            "lessonNumber": request.data.get("lessonNumber", instance.get_lesson_number()),
            "title": request.data.get("title", instance.get_title()),
            "subtitle": request.data.get("subtitle", instance.get_subtitle()),
            "coverImage": request.data.get("coverImage", instance.get_cover_image()),
        }

        # Check if "pages" is in the request data
        if "pages" in request.data:
            try:
                updated_pages = json.loads(request.data["pages"])
            except json.JSONDecodeError:
                return Response({"error": "Invalid JSON data for 'pages'"}, status=status.HTTP_400_BAD_REQUEST)

            existing_pages = LessonContent.objects.filter(lesson=instance)

            # Update or create pages in the request
            updated_page_ids = set()
            for page_data in updated_pages:
                page_id = page_data.get('id')

                if page_id:
                    # Update an existing page
                    existing_page = existing_pages.filter(id=page_id).first()
                    if existing_page:
                        content = page_data.get('contents', '')
                        if not isinstance(content, str):
                            content = str(content)  # Convert to string if needed

                        existing_page.contents = content + "<!-- delimiter -->"
                        existing_page.url = page_data.get('url', None)
                        existing_page.files = page_data.get('files', None)
                        existing_page.save()
                        updated_page_ids.add(existing_page.id)
                    else:
                        return Response({"error": f"Page with ID {page_id} not found"},
                                        status=status.HTTP_404_NOT_FOUND)
                else:
                    # Create a new page
                    new_page = LessonContent()
                    new_page.set_lesson_id(instance.id)

                    content = page_data.get('contents', '')
                    if not isinstance(content, str):
                        content = str(content)

                    new_page.set_contents(content + "<!-- delimiter -->")
                    new_page.set_url(page_data.get('url', None))
                    new_page.set_file(page_data.get('files', None))
                    new_page.save()
                    updated_page_ids.add(new_page.id)

            # Delete pages that are not in the updated request
            for existing_page in existing_pages:
                if existing_page.id not in updated_page_ids:
                    existing_page.delete()

        # Check if "lesson_files" is in the request data
        if "lesson_files" in request.FILES:
            try:
                updated_files = request.FILES.getlist('lesson_files')
            except:
                return Response({"error": "Invalid files data"}, status=status.HTTP_400_BAD_REQUEST)

            existing_files = File.objects.filter(lesson=instance)

            # Update or create new files, append to the existing files
            updated_file_ids = set()
            for uploaded_file in updated_files:
                file_serializer = FileSerializer(data={'file': uploaded_file, 'lesson': instance.id})
                if file_serializer.is_valid():
                    file_serializer.save()
                    updated_file_ids.add(file_serializer.data['id'])

            # Retain existing files and append new ones (no deletion unless explicitly required)
            updated_file_ids.update(existing_files.values_list('id', flat=True))

        # Handle file deletion if "files_to_delete" is provided
        if "files_to_delete" in request.data:
            files_to_delete = json.loads(request.data.get('files_to_delete', '[]'))
            existing_files = File.objects.filter(lesson=instance, id__in=files_to_delete)
            for file in existing_files:
                file.delete()

        # Update other lesson fields if needed
        instance.set_lesson_number(lesson_data['lessonNumber'])
        instance.set_title(lesson_data['title'])
        instance.set_subtitle(lesson_data['subtitle'])
        instance.set_cover_image(lesson_data['coverImage'])
        instance.save()

        # Retrieve the updated list of pages for the response
        updated_pages_data = LessonContentSerializer(LessonContent.objects.filter(lesson=instance), many=True).data

        # Retrieve the updated list of files for the response
        updated_files_data = FileSerializer(File.objects.filter(lesson=instance), many=True).data

        # Include the updated pages in the response
        response_data = LessonSerializer(instance).data
        response_data['pages'] = updated_pages_data
        response_data['lesson_files'] = updated_files_data

        return Response(response_data)



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
        
        # Check notification if exist and delete
        notification = Notification.objects.filter(lesson_id=lesson_id)

        if notification is not None:
            notification.delete()

        instance.delete()

        return Response({"success": "Lesson deleted"})
