from rest_framework import serializers
from api.model.File import File
from api.model.Lesson import Lesson

class FileSerializer(serializers.ModelSerializer):
    lesson = serializers.PrimaryKeyRelatedField(queryset=Lesson.objects.all(), allow_null=True)

    class Meta:
        model = File
        fields = ('id', 'lesson', 'file')
