from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from api.serializer.ContentHistorySerializer import ContentHistorySerializer
from api.model.ContentHistory import ContentHistory
from api.controllers.permissions.permissions import IsTeacher
from api.model.Lesson import Lesson

class ContentHistoryController(ModelViewSet):
    queryset = ContentHistory.objects.all()
    serializer_class = ContentHistorySerializer

    # authentication_classes = [SessionAuthentication, TokenAuthentication]

    # def get_permissions(self):
    #     if self.action in ['createHistory', 'getHistoryById']:
    #         return [IsAuthenticated(), IsTeacher()]
    #     else:
    #         return [IsAuthenticated()]
    # allow permission for now

    from django.core.exceptions import ObjectDoesNotExist

    def createHistory(self, request, lesson_id=None):
          
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        content = request.data.get('content')

        try:
            # Check if the lesson exists
            if not Lesson.objects.filter(id=lesson_id).exists():  # Assuming you have a Lesson model
                return Response({"error": "Lesson does not exist."}, status=status.HTTP_404_NOT_FOUND)

            # Retrieve the latest version number for the given lesson_id
            latest_version = ContentHistory.objects.filter(lessonId=lesson_id).count() + 1

            # Create the ContentHistory instance
            content_history = ContentHistory.objects.create(
                lessonId_id=lesson_id,
                content=content,
                version=latest_version
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(ContentHistorySerializer(content_history).data, status=status.HTTP_201_CREATED)


    # Get history by historyId
    def getHistoryByHistoryId(self, request, history_id=None):

        if not history_id:
            return Response({"error": "history_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the ContentHistory by history_id (no need for lesson_id)
            content_history = ContentHistory.objects.get(historyId=history_id)
            
            serializer = ContentHistorySerializer(content_history)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ContentHistory.DoesNotExist:
            return Response({"error": "ContentHistory not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Get all content history for a specific lesson by lessonId
    def getAllHistoryByLessonId(self, request, lesson_id=None):

        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        content_histories = ContentHistory.objects.filter(lessonId=lesson_id)
        serializer = ContentHistorySerializer(content_histories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Update ContentHistory (for admin/dev only)
    def updateHistory(self, request, lesson_id=None, history_id=None):

        if not lesson_id or not history_id:
            return Response({"error": "lesson_id and history_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve the existing ContentHistory instance
            content_history = ContentHistory.objects.get(pk=history_id, lessonId=lesson_id)

            # Manually update the fields you want to change
            content = request.data.get('content')
            if content is not None:
                content_history.content = content
            
            # You can update other fields here as necessary

            # Save the changes to the database
            content_history.save()

            # Optionally return the updated instance data
            return Response(ContentHistorySerializer(content_history).data, status=status.HTTP_200_OK)

        except ContentHistory.DoesNotExist:
            return Response({"error": "ContentHistory not found."}, status=status.HTTP_404_NOT_FOUND)


    # Delete ContentHistory (for admin/dev only)
    def deleteHistory(self, request, lesson_id=None, history_id=None):
      if not lesson_id or not history_id:
          return Response({"error": "lesson_id and history_id are required"}, status=status.HTTP_400_BAD_REQUEST)

      try:
          content_history = ContentHistory.objects.get(pk=history_id, lessonId=lesson_id)
          content_history.delete()
          return Response(status=status.HTTP_204_NO_CONTENT)
      except ContentHistory.DoesNotExist:
          return Response({"error": "ContentHistory not found."}, status=status.HTTP_404_NOT_FOUND)
