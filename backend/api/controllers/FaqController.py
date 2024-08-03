from django.db.models import Count
from django.utils import timezone
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from api.model import Notification
from api.model.Faq import Faq
from api.model.SubQuery import SubQuery
from api.model.Lesson import Lesson
from api.model.Query import Query
from api.model.RelatedContent import RelatedContent
from api.serializer.FaqSerializer import FaqSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10

class FaqController(ModelViewSet):
    queryset = Faq.objects.all()
    serializer_class = FaqSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['related_content', 'lesson']
    search_fields = ['question', 'related_content__general_context', 'lesson__title', 'lesson__subtitle']
    ordering_fields = ['id', 'question', 'lesson__title', 'related_content__related_content_id']
    ordering = ['id']
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    pagination_class = StandardResultsSetPagination

    @action(detail=False, methods=['get'])
    def paginated_general_context_group(self, request):
        lesson_id = request.query_params.get('lesson_id')
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        faqs = self.queryset.filter(lesson__id=lesson_id).values(
            'related_content__related_content_id',
            'related_content__general_context'
        ).annotate(count=Count('related_content__related_content_id')).order_by('-count')
        # this part
        # # Check if any count is 10 and send a notification
        # for faq in faqs:
        #     if faq['count'] == 10:
        #         lesson = Lesson.objects.get(id=lesson_id)
        #         Notification.objects.create(
        #             lesson=lesson,
        #             message=f"FAQ for lesson {lesson_id} has reached 10 related contents.",
        #             is_read=False,
        #             date_created=timezone.now()
        #         )
        #         break
        page = self.paginate_queryset(faqs)


        if page is not None:
            return self.get_paginated_response(page)

        return Response(faqs)

    @action(detail=False, methods=['get'] )
    # paginated questions base on lesson_id and related_content_id
    def paginated_questions(self, request):
        lesson_id = request.query_params.get('lesson_id')
        related_content_id = request.query_params.get('related_content_id')

        if not lesson_id or not related_content_id:
            return Response({"error": "lesson_id and related_content_id are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        faqs = self.queryset.filter(lesson_id=lesson_id, related_content_id=related_content_id)
        page = self.paginate_queryset(faqs)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(faqs, many=True)
        return Response(serializer.data)
    def get_count_faq_questions_all(self, request):
        faq_data = []

        for faq in self.queryset:
            questions = faq.question.split('\n')
            question_count = len([q for q in questions if q.strip() != ''])
            faq_data.append({
                'faq_id': faq.id,
                'questions': questions,
                'question_count': question_count
            })
        
        return Response(faq_data)

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
                    faq.save()  # Ensure save method is called to trigger notification logic
                    faqs.append(faq)

            return Response({"message": "FAQs created successfully"}, status=status.HTTP_201_CREATED)
        except Query.DoesNotExist:
            return Response({"error": "No Queries found for the specified lesson ID"}, status=status.HTTP_404_NOT_FOUND)