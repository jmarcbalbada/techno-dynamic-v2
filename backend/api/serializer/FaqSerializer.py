from rest_framework import serializers
from api.model.Faq import Faq
from api.serializer import LessonSerializer
from api.serializer.RelatedContentSerializer import RelatedContentSerializer


class FaqSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    related_content = RelatedContentSerializer(read_only=True)
    class Meta:
        model = Faq
        fields = '__all__'
