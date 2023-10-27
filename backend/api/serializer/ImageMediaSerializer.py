from rest_framework import serializers
from api.model.ImageMedia import ImageMedia

class ImageMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageMedia
        fields = ('id', 'image_link')

