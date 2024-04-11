from rest_framework import serializers
from ..models import Suggestion

class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = ['id', 'lesson', 'insights', 'content', 'old_content']
