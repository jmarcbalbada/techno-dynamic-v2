from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, DestroyModelMixin
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from api.model.ImageModel import ImageModel
from api.model.LessonContent import LessonContent
from api.serializer.ImageModelSerializer import ImageModelSerializer

class ImageModelController(GenericViewSet, CreateModelMixin, ListModelMixin, RetrieveModelMixin, DestroyModelMixin):
    queryset = ImageModel.objects.all()
    serializer_class = ImageModelSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def createImage(self, request, lesson_id, lesson_content_id):
        data = request.data

        # Ensure the associated LessonContent exists
        lesson_content = LessonContent.objects.filter(id=lesson_content_id).first()

        if not lesson_content:
            return Response({"error": "LessonContent not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create and associate the image with the LessonContent
        image = ImageModel(image_link=data['image_link'], lesson_content=lesson_content)
        image.save()
        serializer = ImageModelSerializer(image)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def getAllImageById(self, request, lesson_id, lesson_content_id):
        # Filter images by lesson_content_id
        images = ImageModel.objects.filter(lesson_content__id=lesson_content_id)
        lesson_content = LessonContent.objects.get(id=lesson_content_id)
        serializer = self.get_serializer(images, many=True)
        response_data = {
            "lesson_content_id": lesson_content_id,
            "lesson_content_title": lesson_content.contents,  # Include lesson content title in the response
            "images": serializer.data,
        }
        return Response(response_data)


    def getImageById(self, request, image_id):
        image = self.get_queryset().filter(id=image_id).first()

        if image is None:
            return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ImageModelSerializer(image)
        return Response(serializer.data)

    def deleteImage(self, request, lesson_content_id, image_id):
        # Filter the images by lesson_content_id
        images = ImageModel.objects.filter(lesson_content__id=lesson_content_id, id=image_id)

        if not images.exists():
            return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)

        image = images.first()
        image.delete()
        return Response({"success": "Image deleted"})
    
    def updateImage(self, request, lesson_id, lesson_content_id, image_id):
        data = request.data

        # Filter the images by lesson_id, lesson_content_id, and image_id
        images = ImageModel.objects.filter(lesson_content__id=lesson_content_id, id=image_id, lesson_content__lesson__id=lesson_id)

        if not images.exists():
            return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)

        image = images.first()
        serializer = ImageModelSerializer(image, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


