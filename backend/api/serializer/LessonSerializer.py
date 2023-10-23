from rest_framework import serializers
from api.model.Lesson import Lesson
from api.serializer.ImageModelSerializer import ImageModelSerializer
from api.serializer.LessonContentSerializer import LessonContentSerializer

class LessonSerializer(serializers.ModelSerializer):
    pages = LessonContentSerializer(many=True, read_only=True)
    lesson_urls = LessonContentSerializer(many=True, read_only=True)
    lesson_files = LessonContentSerializer(many=True, read_only=True)
    images = ImageModelSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ('id', 'lesson', 'contents', 'url', 'files', 'images')