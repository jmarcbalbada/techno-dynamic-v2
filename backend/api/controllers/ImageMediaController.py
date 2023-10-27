import json
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from api.model.ImageMedia import ImageMedia
from api.serializer.ImageMediaSerializer import ImageMediaSerializer

class ImageMediaController(GenericViewSet, ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    queryset = ImageMedia.objects.all()
    serializer_class = ImageMediaSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def getAllImageMedia(self, request):
        image_media = ImageMedia.objects.all()
        serializer = self.get_serializer(image_media, many=True)
        return Response(serializer.data)

    def createImageMedia(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def getImageMediaById(self, request, pk):
        image_media = ImageMedia.objects.all().filter(id=pk).first()

        if image_media is None:
            return Response({"error": "Image Media not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(image_media)
        return Response(serializer.data)

    def updateImageMedia(self, request, pk):
        # Use ImageMedia.objects.all() to query all instances of the ImageMedia model.
        instance = ImageMedia.objects.all().filter(id=pk).first()

        if instance is None:
            return Response({"error": "Image Media not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def deleteImageMedia(self, request, pk):
        # Use ImageMedia.objects.all() to query all instances of the ImageMedia model.
        instance = ImageMedia.objects.all().filter(id=pk).first()

        if instance is None:
            return Response({"error": "Image Media not found"}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({"success": "Image Media deleted"})
