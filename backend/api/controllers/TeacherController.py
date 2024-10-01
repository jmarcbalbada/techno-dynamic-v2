# api/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin
from api.model.Teacher import Teacher
from api.serializer.TeacherSerializer import TeacherSerializer


class TeacherController(ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='getthreshold')
    def get_threshold(self, request):
        try:
            teacher_profile = Teacher.objects.get(id=1)
            return Response({"similarity_threshold": teacher_profile.threshold})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['patch'], url_path='setthreshold')
    def set_threshold(self, request):
        threshold = request.data.get('threshold')  # Get the parameter from request.data

        if threshold is None:
            return Response({"error": "threshold parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            threshold_value = float(threshold)  # Convert to float after checking for None
        except ValueError:
            return Response({"error": "threshold parameter must be a float"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            teacher_profile = Teacher.objects.get(id=1)
            teacher_profile.threshold = threshold_value  # Correct field name
            teacher_profile.save()
            # print("succesfully updated threshold",teacher_profile.threshold)
            return Response({"success": f"Threshold updated successfully to value: {threshold_value}"})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'],url_path='getsuggestion')
    def get_suggestion(self, request):
        try:
            teacher_profile = Teacher.objects.get(id=1)
            return Response({"teacher_allow_suggestion": teacher_profile.suggestion})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['patch'], url_path='setsuggestion')
    def set_suggestion(self, request):
        similarity = request.data.get('suggestion')  # Access from request data
        if similarity is None:
            return Response({"error": "similarity parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            teacher_profile = Teacher.objects.get(id=1)  # Example fixed id
            teacher_profile.suggestion = similarity
            teacher_profile.save()
            # print("Successfully set")
            return Response({"success": "Suggestion updated successfully the value is ${similarity}}"})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path='getnotification')
    def get_notification_threshold(self, request):
        try:
            teacher_profile = Teacher.objects.get(id=1)
            return Response({"notification_threshold": teacher_profile.notification_threshold})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['patch'], url_path='setnotification')
    def set_notification_threshold(self, request):
        threshold = request.data.get('notification')  # Get the parameter from request.data

        if threshold is None:
            return Response({"error": "notification parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            threshold_value = int(threshold)  # Convert to int after checking for None
        except ValueError:
            return Response({"error": "notification parameter must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            teacher_profile = Teacher.objects.get(id=1)
            teacher_profile.notification_threshold = threshold_value  # Correct field name
            teacher_profile.save()
            return Response({"success": f"Threshold updated successfully to value: {threshold_value}"})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)