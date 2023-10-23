from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, DestroyModelMixin
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from api.model.ImageModel import ImageModel
from api.serializer.ImageModelSerializer import ImageModelSerializer

class ImageModelController(GenericViewSet, ListModelMixin, RetrieveModelMixin, DestroyModelMixin):
    queryset = ImageModel.objects.all()
    serializer_class = ImageModelSerializer

    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_permissions(self):
        return [IsAuthenticated()]  # All image operations require authentication

    def listImages(self, request):
        images = self.get_queryset()
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)

    def getImageById(self, request, image_id):
        image = self.get_queryset().filter(id=image_id).first()

        if image is None:
            return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ImageModelSerializer(image)
        return Response(serializer.data)

    def deleteImage(self, request, image_id):
        image = self.get_queryset().filter(id=image_id).first()

        if image is None:
            return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)

        image.delete()
        return Response({"success": "Image deleted"})
