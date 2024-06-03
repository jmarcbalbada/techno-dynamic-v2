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

    @action(detail=False, methods=['get'],url_path='getthreshold')
    def get_similarity_threshold(self, request):
        teacher_id = request.query_params.get('teacher_id')
        if not teacher_id:
            return Response({"error": "teacher_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            teacher_profile = Teacher.objects.get(user_id=teacher_id)
            return Response({"similarity_threshold": teacher_profile.similarity_threshold})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def set_similarity_threshold(self, request):
        teacher_id = request.query_params.get('teacher_id')
        threshold = request.query_params.get('threshold')
        if threshold is None:
            return Response({"error": "threshold parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            teacher_profile = Teacher.objects.get(user=request.user)
            teacher_profile.similarity_threshold = threshold
            teacher_profile.save()
            return Response({"success": "Threshold updated successfully"})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def get_teacher_suggestion_similarity(self, request, teacher_id=None):
        if teacher_id is None:
            return Response({"error": "teacher_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            teacher_profile = Teacher.objects.get(user_id=teacher_id)
            return Response({"teacher_suggestion_similarity": teacher_profile.teacher_suggestion_similarity})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def set_teacher_suggestion_similarity(self, request):
        similarity = request.query_params.get('similarity')
        if similarity is None:
            return Response({"error": "similarity parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            teacher_profile = Teacher.objects.get(user=request.user)
            teacher_profile.teacher_suggestion_similarity = similarity
            teacher_profile.save()
            return Response({"success": "Similarity updated successfully"})
        except Teacher.DoesNotExist:
            return Response({"error": "TeacherProfile not found"}, status=status.HTTP_404_NOT_FOUND)         