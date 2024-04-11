from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from ..models import Faq
from api.model.SubQuery import SubQuery
from api.model.Lesson import Lesson
from api.model.Query import Query
from api.serializer.FaqSerializer import FaqSerializer

class FaqController(ModelViewSet):
    queryset = Faq.objects.all()
    serializer_class = FaqSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_questions_by_lesson_id(self, request, lesson_id):
        try:
            faqs = self.get_queryset().filter(lesson_id=lesson_id)
            print(faqs)
            serializer = self.serializer_class(faqs, many=True)
            return Response(serializer.data)
        except Faq.DoesNotExist:
            return Response({"error": "No FAQs found for the specified lesson ID"}, status=status.HTTP_404_NOT_FOUND)
        
    def create_faqs_from_subqueries(self, request, lesson_id):
        try:
            # Retrieve the Query objects for the specified lesson ID
            queries = Query.objects.filter(lesson_id=lesson_id)

            # Initialize a list to hold the Faq objects
            faqs = []

            # TODO: Implement AI to generate FAQ before adding the FAQ to table

            # Iterate through each Query object
            for query in queries:
                # Retrieve the SubQuery objects associated with the Query
                subqueries = query.subqueries.all()

                # Create a Faq object for each SubQuery
                for subquery in subqueries:
                    faq = Faq(
                        lesson_id=lesson_id,
                        question=subquery.question
                    )
                    faqs.append(faq)

            # Bulk create the Faq objects
            Faq.objects.bulk_create(faqs)

            return Response({"message": "FAQs created successfully"}, status=status.HTTP_201_CREATED)
        except Query.DoesNotExist:
            return Response({"error": "No Queries found for the specified lesson ID"}, status=status.HTTP_404_NOT_FOUND)