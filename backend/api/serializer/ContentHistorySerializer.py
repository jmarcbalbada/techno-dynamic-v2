from rest_framework import serializers
from api.model.ContentHistory import ContentHistory

class ContentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentHistory
        fields = ['historyId', 'lessonId', 'content', 'version', 'updatedAt']
