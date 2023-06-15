from rest_framework import serializers
from api.model.LessonContent import LessonContent

class LessonContentSerializer(serializers.ModelSerializer):

    class Meta:
        model = LessonContent
        fields = ['id', 'contents', 'url', 'files']