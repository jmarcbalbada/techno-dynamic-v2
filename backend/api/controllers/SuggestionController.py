from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from api.model.Suggestion import Suggestion
from api.serializer.SuggestionSerializer import SuggestionSerializer
from api.serializer.FaqSerializer import FaqSerializer
from api.serializer.LessonContentSerializer import LessonContentSerializer
from api.model.Notification import Notification
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.conf import settings
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from api.model.Faq import Faq
from api.model.Suggestion import Suggestion
from api.model.Lesson import Lesson
from api.model.LessonContent import LessonContent
from api.model.Query import Query
from api.model.GroupedQuestions import GroupedQuestions
from api.model.SubQuery import SubQuery
from api.controllers.static.prompts import *
import openai

import os

class SuggestionController(ModelViewSet):
    queryset = Suggestion.objects.all()
    serializer_class = SuggestionSerializer
    
    def createInsight(self, request):
        lesson_id = request.data.get('lesson_id')
        notification_id = request.data.get('notification_id')
        
        if not lesson_id or not notification_id:
            return Response({"error": "lesson_id or notification_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # guard lesson and notification check if exists
        existing_lesson = Lesson.objects.filter(id=lesson_id).first()
        existing_notification = Notification.objects.filter(notif_id=notification_id).first()

        if not existing_lesson or not existing_notification:
            return Response({"error": "Lesson or Notification does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a suggestion already exists for the lesson
        existing_suggestion, IsCreated = Suggestion.objects.get_or_create(lesson_id=lesson_id)

        # Check if existing_suggestion has insight value early return
        # if existing_suggestion and existing_suggestion.insights:
        #     return Response(SuggestionSerializer(existing_suggestion).data, status=status.HTTP_200_OK)

        # Fetch lesson contents
        lesson_contents = LessonContent.objects.filter(lesson_id=lesson_id)
        
        # Serialize and clean lesson content data
        lesson_content_serializer = LessonContentSerializer(lesson_contents, many=True)
        lesson_content_data = lesson_content_serializer.data

        # Ensure the content field exists in lesson content data
        lesson_content_text = "\n".join([content['contents'] for content in lesson_content_data if 'contents' in content])
        print("content: ", lesson_content_text)

        # Get grouped questions related to the given notification_id
        grouped_questions = GroupedQuestions.objects.filter(notification_id=notification_id, lesson_id=lesson_id)
        
        # Get FAQs related to these grouped questions
        faqs = Faq.objects.filter(grouped_questions__in=grouped_questions).select_related('grouped_questions__notification')

        # Prepare the response data with only questions
        faq_questions = [faq.question for faq in faqs if faq.grouped_questions and faq.grouped_questions.notification]

        input_text = prompt_create_insights_abs(faq_questions,lesson_content_text)
        
        try:
            # Call OpenAI API to get the suggestion
            openai.api_key = os.environ.get("OPENAI_API_KEY")
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": SUGGESTION_SYSTEM_CONTENT_INSIGHTS},
                    {"role": "user", "content": input_text}
                ],
                max_tokens=1500,
                temperature=0.7,
            )
            ai_response = response['choices'][0]['message']['content'].strip()
            ai_response = ai_response.replace('\n', '')
            # Remove any instances of ** from the response
            ai_response = ai_response.replace('**', '')
            print("AI RESPONSE:", ai_response)

            # Update the existing suggestion with the new insights and old content
            existing_suggestion.insights = ai_response
            # existing_suggestion.content = None
            if not existing_suggestion.old_content:
                existing_suggestion.old_content = lesson_content_text
            existing_suggestion.save()

            # Reformat faq_questions into bullet points
            formatted_faq_questions = '<p><i>'.join([f"&#8226; {question}" for question in faq_questions]) + '</i></p>'

            response_data = {
                "suggestion": SuggestionSerializer(existing_suggestion).data,
                "faq_questions": formatted_faq_questions
            }

            if IsCreated:
                return Response(response_data, status=status.HTTP_201_CREATED)
            
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def createContent(self, request):
        lesson_id = request.data.get('lesson_id')
        notification_id = request.data.get('notification_id')
        
        if not lesson_id or not notification_id:
            return Response({"error": "lesson_id or notification_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # guard lesson and notification check if exists
        existing_lesson = Lesson.objects.filter(id=lesson_id).first()
        existing_notification = Notification.objects.filter(notif_id=notification_id).first()

        if not existing_lesson or not existing_notification:
            return Response({"error": "Lesson or Notification does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a suggestion already exists for the lesson
        existing_suggestion, IsCreated = Suggestion.objects.get_or_create(lesson_id=lesson_id)

        # Check if existing_suggestion has insight value early return
        # if existing_suggestion and existing_suggestion.content:
        #     return Response(SuggestionSerializer(existing_suggestion).data, status=status.HTTP_200_OK)
        
        # Fetch lesson contents
        lesson_contents = LessonContent.objects.filter(lesson_id=lesson_id)
        
        # Serialize and clean lesson content data
        lesson_content_serializer = LessonContentSerializer(lesson_contents, many=True)
        lesson_content_data = lesson_content_serializer.data

        # Ensure the content field exists in lesson content data
        lesson_content_text = "\n".join([content['contents'] for content in lesson_content_data if 'contents' in content])
        print("content: ", lesson_content_text)

        # Get grouped questions related to the given notification_id
        grouped_questions = GroupedQuestions.objects.filter(notification_id=notification_id, lesson_id=lesson_id)
        
        # Get FAQs related to these grouped questions
        faqs = Faq.objects.filter(grouped_questions__in=grouped_questions).select_related('grouped_questions__notification')

        # Prepare the response data with only questions
        faq_questions = [faq.question for faq in faqs if faq.grouped_questions and faq.grouped_questions.notification]

        input_text = prompt_create_content_abs(faq_questions,lesson_content_text)
        
        try:
            # Call OpenAI API to get the suggestion
            openai.api_key = os.environ.get("OPENAI_API_KEY")
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": SUGGESTION_SYSTEM_CONTENT},
                    {"role": "user", "content": input_text}
                ],
                max_tokens=1500,
                temperature=0.7,
            )
            ai_response = response['choices'][0]['message']['content'].strip()
            # Preprocess the response to ensure it uses <br> and removes unwanted characters
            # Remove all newlines and replace with <br>
            ai_response = ai_response.replace('\n', '')
            # Remove any instances of ** from the response
            ai_response = ai_response.replace('**', '')

            # Update the existing suggestion with the new insights and old content
            existing_suggestion.content = ai_response
            # existing_suggestion.content = None
            if not existing_suggestion.old_content:
                existing_suggestion.old_content = lesson_content_text
            existing_suggestion.save()

            if IsCreated:
                return Response(SuggestionSerializer(existing_suggestion).data, status=status.HTTP_201_CREATED)
            
            return Response(SuggestionSerializer(existing_suggestion).data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def updateContent(self, request):
        lesson_id = request.data.get('lesson_id')
        print("lesson id = ", lesson_id)
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Fetch the Suggestion content based on the lesson_id
            suggestion = Suggestion.objects.filter(lesson_id=lesson_id).first()
            if not suggestion:
                return Response({"error": "No suggestion found for the given lesson_id"}, status=status.HTTP_404_NOT_FOUND)

            new_content = suggestion.content
            print("new content", new_content)

            # Update the lesson with the new content
            lesson = LessonContent.objects.get(lesson_id=lesson_id)
            lesson.contents = new_content
            print("lesson contents", lesson.contents)
            lesson.save()
            
            return Response({"message": "Lesson content updated successfully"}, status=status.HTTP_200_OK)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # revert content
    def updateRevertContent(self, request):
        lesson_id = request.data.get('lesson_id')
        print("lesson id = ", lesson_id)
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Fetch the Suggestion content based on the lesson_id
            suggestion = Suggestion.objects.filter(lesson_id=lesson_id).first()
            if not suggestion:
                return Response({"error": "No suggestion found for the given lesson_id"}, status=status.HTTP_404_NOT_FOUND)

            old_content = suggestion.old_content
            if not old_content:
                return Response({"error": "No old content found in the suggestion"}, status=status.HTTP_404_NOT_FOUND)
            print("old content", old_content)

            # Update the LessonContent with the old content
            lesson_content = LessonContent.objects.filter(lesson_id=lesson_id).first()
            if not lesson_content:
                return Response({"error": "Lesson content not found"}, status=status.HTTP_404_NOT_FOUND)
            lesson_content.contents = old_content
            lesson_content.save()
            
            return Response({"message": "Lesson content reverted successfully"}, status=status.HTTP_200_OK)
        except LessonContent.DoesNotExist:
            return Response({"error": "Lesson content not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # delete suggestion and faq related
    def deleteSuggestionByLessonId(self, request):
        lesson_id = request.data.get('lesson_id')
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Delete the Suggestion based on the lesson_id
            suggestion = Suggestion.objects.filter(lesson_id=lesson_id).first()
            if not suggestion:
                return Response({"error": "No suggestion found for the given lesson_id"}, status=status.HTTP_404_NOT_FOUND)
            suggestion.delete()

            # Delete the FAQs based on the lesson_id
            # faqs = Faq.objects.filter(lesson_id=lesson_id)
            # faqs.delete()
            
            return Response({"message": "Suggestion deleted successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
