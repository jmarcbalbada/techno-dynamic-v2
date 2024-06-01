from rest_framework import serializers
from api.model.Faq import Faq

class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = '__all__'
