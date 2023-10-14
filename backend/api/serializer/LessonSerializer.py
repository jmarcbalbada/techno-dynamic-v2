from rest_framework import serializers
from api.model.Lesson import Lesson
from api.serializer.LessonContentSerializer import LessonContentSerializer

class LessonSerializer(serializers.ModelSerializer):
    pages = LessonContentSerializer(many=True, read_only=True)
    lesson_urls = LessonContentSerializer(many=True, read_only=True)
    lesson_files = LessonContentSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', "lessonNumber", 'title', 'subtitle', 'coverImage', 'pages', 'lesson_files', 'lesson_urls']