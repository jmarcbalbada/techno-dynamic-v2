from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, DestroyModelMixin
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from api.model import Lesson, SubQuery
from api.model.Query import Query
from api.models import CustomUser
from api.serializer.QuerySerializer import QuerySerializer

class QueryController(GenericViewSet, ListModelMixin, RetrieveModelMixin, CreateModelMixin, DestroyModelMixin):
    queryset = Query.objects.all()
    serializer_class = QuerySerializer

    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def getAllQueries(self, request):
        queries = self.get_queryset()
        serializer = self.serializer_class(queries, many=True)
        return Response(serializer.data)

    def getQueryById(self, request, pk):
        try:
            query = self.queryset.get(pk=pk)
        except Query.DoesNotExist:
            return Response({"error": "Query not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(query)
        return Response(serializer.data)

    def createQuery(self, request):
        data = request.data

        newQuery = Query()
        newQuery.set_lesson(Lesson.objects.get(id=data['lesson_id']))
        newQuery.set_user(CustomUser.objects.get(id=data['user_id']))
        newQuery.save()

        for subquery_id in data['subqueries_ids']:
            subquery = SubQuery.objects.get(id=subquery_id)
            newQuery.add_subquery(subquery)

        serializer = self.get_serializer(newQuery)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def deleteQuery(self, request, pk):
        try:
            query = self.queryset.get(pk=pk)
        except Query.DoesNotExist:
            return Response({"error": "Query not found"}, status=status.HTTP_404_NOT_FOUND)
        query.delete()
        return Response({"success": "Query deleted"}, status=status.HTTP_204_NO_CONTENT)
