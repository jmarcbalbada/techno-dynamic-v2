
from rest_framework import serializers
from api.model.RelatedContent import  RelatedContent

class RelatedContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelatedContent
        fields = '__all__'

