from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from api.model.Suggestion import Suggestion
from api.serializer.SuggestionSerializer import SuggestionSerializer  # Adjust the import path as needed
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
from api.model.SubQuery import SubQuery
import openai

import os

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
    
    def createSuggestion(self, request):
        lesson_id = request.data.get('lesson_id')
        print("here here", lesson_id)
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a suggestion already exists for the lesson
        existing_suggestion = Suggestion.objects.filter(lesson_id=lesson_id).first()
        if existing_suggestion:
            return Response(SuggestionSerializer(existing_suggestion).data, status=status.HTTP_200_OK)

        # Fetch FAQs for the lesson
        faqs = Faq.objects.filter(lesson_id=lesson_id)
        faq_serializer = FaqSerializer(faqs, many=True)
        faq_data = faq_serializer.data

        # Fetch Lesson Contents for the lesson
        lesson_contents = LessonContent.objects.filter(lesson_id=lesson_id)
        print("RAW LESSON CONTENT",lesson_contents)
        lesson_content_serializer = LessonContentSerializer(lesson_contents, many=True)
        lesson_content_data = lesson_content_serializer.data
        print("Serialized Lesson Contents:", lesson_content_data)
        for content in lesson_content_data:
            print("\n\nContent:", content['contents']) 

        # Ensure the content field exists in lesson content data
        lesson_content_text = "\n".join([content['contents'] for content in lesson_content_data if 'contents' in content])
        
        print("\n\nLESSON CONTENT = ",lesson_content_text)
        # Format data for the AI
        faq_text = "\n".join([faq['question'] for faq in faq_data])
        print("faq_text",faq_text)

        # Prepare the input for the AI
        input_text = f"""
            Here are some FAQs from students:
            {faq_text}

            Here are the original lesson contents:
            {lesson_content_text}

            NOTE: PLEASE DO NOT USE \\n IF YOU NEED TO BREAK A LINE USE <br> INSTEAD AND IF YOU WANT TO BOLD A TITLE OR WORD USE <strong>TITLE HERE</strong>. RETURN IN HTML MARKUP, I DON'T WANT TO SEE NEWLINES USE <br> .
            NOTE VERY IMPORTANT: IF THERE IS A VIDEO LINK IN THE CONTENT YOU MUST RETAIN IT
            NOTE VERY IMPORTANT: FOR HEADERS OR TITLE USE <h1> UNTIL <h3> DONT USE **TITLE** SINCE YOU NEED TO RETURN HTML MARKUP

            Based on these FAQs and original lesson contents, provide:
            1. Insights in bullet form similar to the following examples this is insight based on the faq from students so most likely you will tell the user (teacher) that Students are most likely eager to learn etc etc.., return in HTML MARKUP: DONT ANSWER STARTING WITH \"Insights:\", just go directly with answers DO NOT MENTION ENHANCED INSIGHTS OR ETC
            - <strong>Entrepreneurship's Impact:</strong> Students are keen to explore entrepreneurship's role in driving economic growth and innovation, especially in identifying opportunities and fostering competition.<br>
            - <strong>Qualities of Success:</strong> There's strong interest in the qualities defining successful entrepreneurs, emphasizing creativity, determination, and resilience.<br>
            - <strong>Technological Influence:</strong> Students recognize the importance of technology in entrepreneurship, highlighting the need to leverage advancements for innovation and competitiveness.<br>
            - <strong>Areas for Improvement:</strong> To enhance learning, deeper insights into specific strategies for opportunity identification, risk management, and technological integration could be provided.<br>
            - <strong>Unlock the full potential of your lesson materials:</strong> By addressing student curiosity and strengthening key concepts.<br>
            Limit to these 5 bullets just focus on painpointing what might wrong in the lesson and how to address them.

            2. An enhanced version of the lesson content based on the FAQs and original content, making it richer and more informative, USE MORE SCHOOL APPROPRIATE WORDS PARAPHRASE SOME OF THEM. Cite some short examples if possible for each scenarios make it detailed, Paraphrase the title of 2. make it more understandable. If you can, provide a youtube video links embedded that would be highly appreciated, return in HTML MARKUP PLEASE DO NOT USE \\n IF YOU NEED TO BREAK A LINE USE <br> INSTEAD. Based on these FAQs and original lesson contents. DONT ANSWER STARTING WITH \"Enhanced Lesson Content:\", just go directly with answers DO NOT MENTION ENHANCED LESSON CONTENT, IF THERE IS A YOUTUBE VIDEO LINK IN THE CONTENT YOU MUST RETAIN IT
            You must have a summary at the bottom part of the lesson content so that you will leave a good impression and detailed explanation to users.
            NOTE: PLEASE DO NOT USE \\n IF YOU NEED TO BREAK A LINE USE <br> INSTEAD AND IF YOU WANT TO BOLD A TITLE OR WORD USE <strong>TITLE HERE</strong>. RETURN IN HTML MARKUP, I DON'T WANT TO SEE NEWLINES USE <br> .
            NOTE: IF THERE IS A YOUTUBE VIDEO LINK IN THE CONTENT YOU MUST RETAIN IT
            """


        try:
            # Call OpenAI API to get the suggestion
            openai.api_key = os.environ.get("OPENAI_API_KEY")
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant. ALWAYS RESPOND IN HTML MARKUP, USE <br> for newlines instead of \\n, if there is a video link in the input_text you must retain it, dont state the title like \" Insights, Enhanced Lesson Content\" instead go directly to your answer and use <h1> up to <h3> for titles, not **, also you dont have to say 1. or 2. when you answer those numbers just go directly"},
                    {"role": "user", "content": input_text}
                ],
                max_tokens=1500,
                temperature=0.7,
            )
            ai_response = response['choices'][0]['message']['content'].strip()

            # Parse the AI response
            insights, enhanced_content = ai_response.split('\n\n', 1)

            # Save the suggestion
            suggestion = Suggestion.objects.create(
                lesson_id=lesson_id,
                insights=insights.strip(),
                content=enhanced_content.strip(),
                old_content=lesson_content_text,
            )

            return Response(SuggestionSerializer(suggestion).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

    def destroy(self, request, pk=None):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
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
            faqs = Faq.objects.filter(lesson_id=lesson_id)
            faqs.delete()
            
            return Response({"message": "Suggestion and FAQs deleted successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
