from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from api.model.Content import Content
from api.serializer.ContentSerializer import ContentSerializer

class ContentController(ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
