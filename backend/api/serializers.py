from rest_framework import serializers
from .models import Lesson

class LessonSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content']