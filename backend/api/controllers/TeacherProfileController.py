# api/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from api.model.TeacherProfile import TeacherProfile
from api.serializer.TeacherProfileSerializer import TeacherProfileSerializer

class TeacherProfileController(ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer

    @action(detail=False, methods=['get'], url_path='get-threshold')
    def get_threshold(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            teacher_profile = TeacherProfile.objects.get(user_id=user_id)
            return Response({"user_id": user_id, "similiarity_threshold": teacher_profile.similiarity_threshold})
        except TeacherProfile.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)
