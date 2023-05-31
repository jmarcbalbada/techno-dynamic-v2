from rest_framework import serializers
from api.model import LessonContents


class LessonContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonContents
        fields = ['id', 'contents', 'files']