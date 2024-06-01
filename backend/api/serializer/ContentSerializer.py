
from rest_framework import serializers
from api.model.Content import  Content

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = '__all__'