from rest_framework import serializers
from ..models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['notif_id', 'lesson', 'message', 'date_created']
