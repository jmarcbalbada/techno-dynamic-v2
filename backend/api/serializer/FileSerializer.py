from rest_framework import serializers
from api.model import File

class FileMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ('id', 'file')
