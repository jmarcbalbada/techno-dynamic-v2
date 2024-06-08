# views.py

from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from api.model.GroupedQuestions import GroupedQuestions
from api.serializer.GroupedQuestionsSerializer import GroupedQuestionsSerializer

class GroupedQuestionsController(ModelViewSet):
    queryset = GroupedQuestions.objects.all()
    serializer_class = GroupedQuestionsSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

