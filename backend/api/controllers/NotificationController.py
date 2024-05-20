from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from ..models import Notification
from api.serializer.NotificationSerializer import NotificationSerializer

class NotificationController(ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_all_notification(self, request):
        try:
            all_notifications = self.queryset.all()  # Fetch all notifications
            serializer = self.get_serializer(all_notifications, many=True)
            # print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_all_count_unread_notif(self, request):
        try:
            unread_notifs_count = self.queryset.filter(is_read=False).count()
            return Response({"unread_count": unread_notifs_count}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def mark_all_as_read(self, request):
        try:
            unread_notifs = self.queryset.filter(is_read=False)
            unread_notifs.update(is_read=True)
            return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def deleteNotification(self, request):
        lesson_id = request.data.get('lesson_id')
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Fetch the Notification based on the lesson_id
            notification = Notification.objects.filter(lesson_id=lesson_id).first()
            if not notification:
                return Response({"error": "No notification found for the given lesson_id"}, status=status.HTTP_404_NOT_FOUND)

            # Delete the notification
            notification.delete()
            
            return Response({"message": "Notification deleted successfully"}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
