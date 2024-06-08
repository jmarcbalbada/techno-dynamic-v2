# api/serializers.py

from rest_framework import serializers
from api.model.NoticeNotifier import NoticeNotifier

class NoticeNotifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeNotifier
        fields = '__all__'
