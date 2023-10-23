from rest_framework import serializers
from api.model.ImageModel import ImageModel

class ImageModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageModel
        fields = ('id', 'image_link', 'lesson_content')  # Add 'lesson_content' if it's a foreign key field

