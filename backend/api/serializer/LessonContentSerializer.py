from rest_framework import serializers
from api.serializer.ImageModelSerializer import ImageModelSerializer
from api.model.LessonContent import LessonContent

class LessonContentSerializer(serializers.ModelSerializer):
    images = ImageModelSerializer(many=True, read_only=True)

    class Meta:
        model = LessonContent
        fields = ['id', 'contents', 'url', 'files', 'images']