import json
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

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

        lesson_contents = []

        # Create LessonContents for each page
        if 'pages' in data:
            pages_data = json.loads(data['pages'])

            for page_data in pages_data:
                page_contents = page_data.get('contents', '')
                page_url = page_data.get('url', None)
                page_files = page_data.get('files', None)

                new_page = LessonContent()
                new_page.set_lesson_id(newLesson.id)
                new_page.set_contents(page_contents)
                new_page.set_url(page_url)
                new_page.set_file(page_files)
                new_page.save()
                lesson_contents.append(new_page)

        lesson_data = LessonSerializer(newLesson).data
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
                        existing_page.contents = page_data.get('contents', '')
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
                    new_page.set_contents(page_data.get('contents', ''))
                    new_page.set_url(page_data.get('url', None))
                    new_page.set_file(page_data.get('files', None))
                    new_page.save()
                    updated_page_ids.add(new_page.id)

            # Delete pages that are not in the updated request
            for existing_page in existing_pages:
                if existing_page.id not in updated_page_ids:
                    existing_page.delete()

        # Update other lesson fields if needed
        instance.set_lesson_number(lesson_data['lessonNumber'])
        instance.set_title(lesson_data['title'])
        instance.set_subtitle(lesson_data['subtitle'])
        instance.set_cover_image(lesson_data['coverImage'])
        instance.save()

        # Retrieve the updated list of pages for the response
        updated_pages_data = LessonContentSerializer(LessonContent.objects.filter(lesson=instance), many=True).data

        # Include the updated pages in the response
        response_data = LessonSerializer(instance).data
        response_data['pages'] = updated_pages_data

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

        instance.delete()

        return Response({"success": "Lesson deleted"})
