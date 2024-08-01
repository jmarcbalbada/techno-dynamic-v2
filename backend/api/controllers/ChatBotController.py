import json
# import openai
import os
from api.controllers.static.prompts import *

from django.db.models import Count
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from django.conf import settings
from bs4 import BeautifulSoup
from django.utils import timezone
from .RelatedContentController import RelatedContentController
from api.model.Faq import Faq
from dotenv import load_dotenv

# Load environment variables from .env file

from api.model.Faq import Faq
from api.model.Suggestion import Suggestion
from api.model.Lesson import Lesson
from api.model.RelatedContent import RelatedContent
from api.model.LessonContent import LessonContent
from api.model.Query import Query
from api.model.SubQuery import SubQuery

from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.viewsets import GenericViewSet

from langchain_community.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory

from ..model import Notification


class ChatBotController(GenericViewSet):
    load_dotenv()
    # openai_api_key = settings.OPENAI_API_KEY
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def chatbot_response(self, request, lesson_id, lesson_content_id):
        secret_key = os.environ.get("OPENAI_API_KEY")

        # Extract the message from the JSON request body
        try:
            body = json.loads(request.body)
            user_message = body['message']
        except (ValueError, KeyError):
            return HttpResponseBadRequest("Invalid request body")

        # Retrieve the lesson by its ID
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return JsonResponse({"error": "Lesson not found"}, status=404)

        # Retrieve content based on the specified lesson_content_id
        try:
            lesson_content = LessonContent.objects.get(id=lesson_content_id, lesson=lesson)
            content = lesson_content.get_contents()

            # Use BeautifulSoup to parse and extract text from HTML content
            soup = BeautifulSoup(content, 'html.parser')
            content_text = soup.get_text()
        except LessonContent.DoesNotExist:
            return HttpResponseNotFound("Lesson content not found")

        # Prepare the history content for the assistant's introduction
        lesson_title = lesson.get_title()
        lesson_subtitle = lesson.get_subtitle()
        content = content_text
        # history_content = f"You are a helpful assistant that provides information based on the lesson provided only. If the question is not related to the lesson, then you can say that it is not related. Lesson Title: {lesson_title}\nSubtitle: {lesson_subtitle}\nContent: {content}. Answer in 2-4 sentences only."
        history_content = prompt_history_content(lesson_title,lesson_subtitle,content)

        # Initialize the conversation context
        conversation_context = []

        # Setup the OpenAI model and memory
        llm = ChatOpenAI(openai_api_key=secret_key, model_name="gpt-3.5-turbo", temperature=0)
        memory = ConversationSummaryBufferMemory(llm=llm)

        memory.save_context({"input": history_content}, {"output": CHATBOT_OUTPUT_CONTEXT})

        # Setup the conversation chain
        conversation = ConversationChain(llm=llm,
                                         memory=memory,
                                         verbose=True)

        # Generate AI response based on user message
        ai_response = conversation.predict(input=f"Can you answer my question or Do what I say directly: {user_message}?")

        # Update the conversation context with the new interaction
        new_interaction = [
            {"role": "user", "content": user_message, "time": timezone.now().isoformat()},
            {"role": "assistant", "content": ai_response, "time": timezone.now().isoformat()}
        ]
        conversation_context.extend(new_interaction)

        # Update the Query object with the new context
        query, created = Query.objects.get_or_create(lesson=lesson, user=request.user)
        query.set_context(json.dumps(conversation_context))
        query.save()

        # Create a new SubQuery with the question and response
        subquery = SubQuery(question=user_message, response=ai_response)
        subquery.save()

        # Add the new SubQuery to the Query's subqueries
        query.add_subquery(subquery)

        # Process the user message and add to FAQ if relevant
        RelatedContentController.process_message_and_add_to_faq(lesson_id, user_message)

        return JsonResponse({"response": ai_response})