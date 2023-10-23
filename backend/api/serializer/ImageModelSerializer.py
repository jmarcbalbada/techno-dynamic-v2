from rest_framework import serializers
from api.model.ImageModel import ImageModel  # Import your ImageModel if it's in a different module

class ImageModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageModel
        fields = ['id', 'imageLink']
