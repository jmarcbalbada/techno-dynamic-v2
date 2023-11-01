import json
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from api.model import File
from api.serializer import FileSerializer

class FileMediaController(GenericViewSet, ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def getAllFileMedia(self, request):
        file_media = File.objects.all()
        serializer = self.get_serializer(file_media, many=True)
        return Response(serializer.data)

    def createFileMedia(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def getFileMediaById(self, request, pk):
        file_media = File.objects.all().filter(id=pk).first()

        if file_media is None:
            return Response({"error": "File Media not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(file_media)
        return Response(serializer.data)

    def updateFileMedia(self, request, pk):
        instance = File.objects.all().filter(id=pk).first()

        if instance is None:
            return Response({"error": "File Media not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def deleteFileMedia(self, request, pk):
        instance = File.objects.all().filter(id=pk).first()

        if instance is None:
            return Response({"error": "File Media not found"}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({"success": "File Media deleted"})
