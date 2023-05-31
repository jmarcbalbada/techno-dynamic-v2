from rest_framework import serializers
from .models import Lesson, LessonContents

class LessonContentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonContents
        fields = ['id', 'contents', 'url', 'files']


class LessonSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    lesson_contents = LessonContentsSerializer(many=True, read_only=True)
    lesson_urls = LessonContentsSerializer(many=True, read_only=True)
    lesson_files = LessonContentsSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'subtitle', 'coverImage', 'lesson_contents', 'lesson_files', 'lesson_urls']