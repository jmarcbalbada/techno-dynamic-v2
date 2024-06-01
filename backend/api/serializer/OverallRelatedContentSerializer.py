from rest_framework import serializers

class OverallRelatedContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OverallRelatedContent
        fields = '__all__'