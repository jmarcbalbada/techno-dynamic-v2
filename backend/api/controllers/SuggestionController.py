from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from ..models import Suggestion
from api.serializer.SuggestionSerializer import SuggestionSerializer  # Adjust the import path as needed

class SuggestionController(ModelViewSet):
    queryset = Suggestion.objects.all()
    serializer_class = SuggestionSerializer

    def get_queryset(self):
        lesson_id = self.kwargs.get('lesson_id')
        if lesson_id is not None:
            return self.queryset.filter(lesson_id=lesson_id)
        return super().get_queryset()

    def list(self, request, lesson_id=None):
        suggestions = self.get_queryset()
        serializer = self.serializer_class(suggestions, many=True) 
        return Response(serializer.data)
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        instance = self.get_object()
        serializer = self.serializer_class(instance)
        return Response(serializer.data)

    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
