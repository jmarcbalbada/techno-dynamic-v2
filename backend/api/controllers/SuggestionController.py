import re
from datetime import datetime
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
from api.controllers.LessonContentController import LessonContentsController
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

        # # Check if a suggestion already exists for the lesson
        # existing_suggestion, IsCreated = Suggestion.objects.get_or_create(lesson_id=lesson_id)

        # Check if there are any existing suggestions for the lesson
        # substitute for get_or_create method
        suggestions = Suggestion.objects.filter(lesson_id=lesson_id)

        if suggestions.exists():
            
            # If only one suggestion exists, use that suggestion
            existing_suggestion = suggestions.first()
            IsCreated = False
        else:
            # Create a new suggestion
            existing_suggestion = Suggestion.objects.create(lesson_id=lesson_id)
            IsCreated = True

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
        # print("content: ", lesson_content_text)

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
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SUGGESTION_SYSTEM_CONTENT_INSIGHTS},
                    {"role": "user", "content": input_text}
                ],
                max_tokens=4000,
                temperature=0.7,
            )
            ai_response = response['choices'][0]['message']['content'].strip()
            ai_response = ai_response.replace('\n', '')
            # Remove any instances of ** from the response
            ai_response = ai_response.replace('**', '')
            # print("AI RESPONSE:", ai_response)

            # Update the existing suggestion with the new insights and old content
            existing_suggestion.insights = ai_response
            # existing_suggestion.content = None
            if not existing_suggestion.old_content:
                existing_suggestion.old_content = lesson_content_text
            # print("old content",existing_suggestion.old_content)
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

        # # Check if a suggestion already exists for the lesson
        # existing_suggestion, IsCreated = Suggestion.objects.get_or_create(lesson_id=lesson_id)

        suggestions = Suggestion.objects.filter(lesson_id=lesson_id)

        if suggestions.exists():
            
            # If only one suggestion exists, use that suggestion
            existing_suggestion = suggestions.first()
            IsCreated = False
        else:
            # Create a new suggestion
            existing_suggestion = Suggestion.objects.create(lesson_id=lesson_id)
            IsCreated = True

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
        # print("con    tent: ", lesson_content_text)

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
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SUGGESTION_SYSTEM_CONTENT},
                    {"role": "user", "content": input_text}
                ],
                # max_tokens=6000, # enough tokens for now
                max_tokens=4000, # enough tokens for now
                temperature=0.5, # more creative
            )
            ai_response = response['choices'][0]['message']['content'].strip()
            # Preprocess the response to ensure it uses <br> and removes unwanted characters
            # Remove all newlines and replace with <br>
            ai_response = ai_response.replace('\n', '')
            # Remove any instances of ** from the response
            ai_response = ai_response.replace('**', '')

            # Clean all marks
            propose_ai_content = self.cleanMarkAiContent(ai_response)
            # print("PROPOSE AI CONTENT = " + propose_ai_content)

            # Updating content to cleaned HTML MARKUP
            existing_suggestion.content = propose_ai_content
            # print("existing_suggestion.content",existing_suggestion.content)

            # existing_suggestion.content = None
            if not existing_suggestion.old_content:
                existing_suggestion.old_content = lesson_content_text

            # print("old content CreateContent",existing_suggestion.old_content)

            existing_suggestion.save()

             # Add the proposed AI response to the response data1
            response_data = {
                'suggestion': SuggestionSerializer(existing_suggestion).data,
                'ai_response': ai_response
            }

            # Return the response with the created or updated status
            if IsCreated:
                return Response(response_data, status=status.HTTP_201_CREATED)

            return Response(response_data, status=status.HTTP_200_OK)

            # if IsCreated:
            #     return Response(SuggestionSerializer(existing_suggestion).data, status=status.HTTP_201_CREATED)
            
            # return Response(SuggestionSerializer(existing_suggestion).data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def updateContent(self, request):
        lesson_id = request.data.get('lesson_id')
        new_content = request.data.get('new_content')
        # print("lesson id = ", lesson_id)

        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        # if not new_content:
        #     return Response({"error": "new_content is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Fetch the Suggestion content based on the lesson_id
            suggestion = Suggestion.objects.filter(lesson_id=lesson_id).first()
            if not suggestion:
                return Response({"error": "No suggestion found for the given lesson_id"},
                                status=status.HTTP_404_NOT_FOUND)

            # filtering the yellow and red mark
            newer_content = self.cleanMarkAiContent(new_content)
            suggestion.content = newer_content
            suggestion.save()

            # Process content via pagination (split by delimiter)
            result = LessonContentsController.split_content_by_delimiter(suggestion.content)
            page_contents = result[1]
            # print("Page contents = ", page_contents)

            # Get All Previous Lesson Contents
            prev_contents = LessonContent.objects.filter(lesson_id=lesson_id).order_by('id')
            prev_contents_list = list(prev_contents)

            # print("length")
            # print("page_contents length = ", len(page_contents))
            # print("prev_contents_list length = ", len(prev_contents_list))

            # Update existing pages first
            for index, content in enumerate(page_contents[:len(prev_contents_list)]):
                lesson_content = prev_contents_list[index]
                lesson_content.contents = content.strip()  # Assign content of the page
                lesson_content.save()
                print(f"Updated LessonContent page {index + 1}: {content}")

            # If new content has more pages than the existing ones, create new LessonContent for the extra pages
            if len(page_contents) > len(prev_contents_list):
                for new_index in range(len(prev_contents_list), len(page_contents)):
                    new_content = page_contents[new_index]
                    if new_content.strip():  # Only create new page if content is not empty
                        new_lesson_content = LessonContent(
                            lesson_id=lesson_id,
                            contents=new_content.strip()
                        )
                        new_lesson_content.save()
                        print(f"Created new LessonContent page {new_index + 1}: {new_content}")

            # Delete the LessonContent entries where the contents are just the delimiter (empty pages)
            LessonContent.objects.filter(lesson_id=lesson_id, contents="<!-- delimiter -->").delete()
            print(f"Deleted blank pages with content only as <!-- delimiter -->")

            # If new content has fewer pages, just update existing pages (no deletion allowed)
            return Response({"message": "Content updated successfully"}, status=status.HTTP_200_OK)

        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Revert content logic
    def updateRevertContent(self, request):
        lesson_id = request.data.get('lesson_id')
        # print("lesson id = ", lesson_id)
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
            
            # Split the old_content using the delimiter
            result = LessonContentsController.split_content_by_delimiter(old_content, isRevert=True)
            page_contents = result[1]
            # print("Split old content into pages:", page_contents)

            # Get all the existing LessonContent records for the lesson_id
            lesson_contents = LessonContent.objects.filter(lesson_id=lesson_id).order_by('id')
            lesson_contents_list = list(lesson_contents)

            print(f"Existing pages: {len(lesson_contents_list)}, Reverted content pages: {len(page_contents)}")

            # Update existing pages
            for index in range(min(len(lesson_contents_list), len(page_contents))):
                lesson_content = lesson_contents_list[index]
                lesson_content.contents = page_contents[index].strip()  # Assign the old page content
                lesson_content.save()
                print(f"Updated LessonContent page {index + 1} with old content")

            # If old content has more pages, create new LessonContent for the excess pages
            if len(page_contents) > len(lesson_contents_list):
                for index in range(len(lesson_contents_list), len(page_contents)):
                    new_lesson_content = LessonContent(
                        lesson_id=lesson_id,
                        contents=page_contents[index].strip()
                    )
                    new_lesson_content.save()
                    print(f"Created new LessonContent page {index + 1} with old content")

            return Response({"message": "Lesson content reverted successfully"}, status=status.HTTP_200_OK)

        except LessonContent.DoesNotExist:
            return Response({"error": "Lesson content not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def getOldContent(self, request, lesson_id):
        # lesson_id = request.data.get('lesson_id')
        # print("old content lesson id = ", lesson_id)
        # Check if lesson_id is provided
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Fetch the suggestion based on lesson_id
            suggestion = Suggestion.objects.filter(lesson_id=lesson_id).first()

            # Check if a suggestion was found
            if not suggestion:
                return Response({"error": "No suggestion found for the given lesson_id"}, status=status.HTTP_404_NOT_FOUND)

            # Return the old_content
            return Response({"old_content": suggestion.old_content}, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Handle any unexpected errors
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
        

    # helper
    @staticmethod
    def cleanMarkAiContent(ai_response):
        """
        This function cleans AI-generated content by performing the following actions:
        1. Removes content wrapped in <mark> tags with 'lightcoral' background.
        2. Removes only <mark> tags while retaining the content for yellow marks.
        3. Removes any newline characters, '**', and '```html' from the content.
        """

        # 1. Remove <mark> tags with 'lightcoral' background and their content
        # This will handle any variations in spaces within the tag
        cleaned_content = re.sub(
            r'<mark\s+style\s*=\s*"background-color\s*:\s*lightcoral\s*;">.*?</mark>', 
            '', ai_response, flags=re.DOTALL | re.IGNORECASE
        )
        
        # 2. Remove <mark> and </mark> tags but retain the content inside them (for yellow marks)
        cleaned_content = re.sub(r'</?mark(?:\s+[^>]+)?>', '', cleaned_content, flags=re.IGNORECASE)
        
        # 3. Replace newline characters with ''
        cleaned_content = cleaned_content.replace('\n', '')
        
        # 4. Remove any instances of '**'
        cleaned_content = cleaned_content.replace('**', '')
        
        # 5. Remove any instances of '```html'
        cleaned_content = cleaned_content.replace('```html', '')

        return cleaned_content
        
