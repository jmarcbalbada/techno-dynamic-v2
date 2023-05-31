from rest_framework import serializers
from api.model import Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id',
            'title',
            'subtitle',
            'lesson_contents',
            'url',
            'lesson_files'
        ]