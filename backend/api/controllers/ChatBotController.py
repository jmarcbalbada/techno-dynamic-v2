import json
import openai
from django.http import JsonResponse, HttpResponseBadRequest
from django.conf import settings
from api.model.Lesson import Lesson
from api.model.LessonContent import LessonContent

from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.viewsets import GenericViewSet

class ChatBotController(GenericViewSet):

    openai.api_key = settings.OPENAI_API_KEY
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def chatbot_response(self, request, lesson_id):
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

        # Get the lesson's pages/content
        lesson_contents = LessonContent.objects.filter(lesson=lesson)
        content_strings = [content.get_contents() for content in lesson_contents]

        # Compile the lesson data into a single string
        lesson_data = f"Title: {lesson.get_title()}\nSubtitle: {lesson.get_subtitle()}\n\n"
        lesson_data += "\n\n".join(content_strings)

        # Using OpenAI's GPT-3.5 to get a response
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": f"You are a helpful assistant that provides information based on the lesson provided only. If the question is not related to the lesson, "
                            f"then you can say that it is not related. Lesson Content: {lesson_data}"},
                {"role": "user", "content": f"Can you answer my question or Do what I say directly: {user_message}?"},
            ],
        )

        bot_message = response['choices'][0]['message']['content'].strip()

        return JsonResponse({"response": bot_message})
