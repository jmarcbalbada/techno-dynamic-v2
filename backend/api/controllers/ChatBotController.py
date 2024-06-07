import json
# import openai
import os

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
        # openai.api_key = self.openai_api_key

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

        # Retrieve or initialize the Query object for the user and lesson
        user = request.user
        query, created = Query.objects.get_or_create(lesson=lesson, user=user)

        # Load the existing conversation context from the Query object, if any
        conversation_context = json.loads(query.context) if query.context else []

        # Check if the conversation context has been created for the first time
        if created:
            # If this is a new query, there will be no past conversation
            past_conversation = []
        else:
            # If this is an existing query, load the conversation context
            past_conversation = []
            sorted_subqueries = query.get_subqueries().order_by('created_at')
            for subquery in sorted_subqueries:
                past_conversation.append(
                    {"role": "user", "content": subquery.question, "time": subquery.created_at.isoformat()})
                past_conversation.append(
                    {"role": "assistant", "content": subquery.response, "time": subquery.created_at.isoformat()})

        lesson_title = lesson.get_title()
        lesson_subtitle = lesson.get_subtitle()
        content = content_text
        history_content = f"You are a helpful assistant that provides information based on the lesson provided only. If the question is not related to the lesson, then you can say that it is not related. Lesson Title: {lesson_title}\nSubtitle: {lesson_subtitle}\nContent: {content}"

        # Combine the past conversation with the current context (if any)
        initial_memory = past_conversation + conversation_context

        # Deduplication function
        def remove_duplicates(past_conversations):
            seen = set()
            cleaned_conversations = []
            for conversation in past_conversations:
                unique_key = (conversation['role'], conversation['content'], conversation['time'])
                if unique_key not in seen:
                    seen.add(unique_key)
                    cleaned_conversations.append(conversation)
            return cleaned_conversations

        # Deduplicate initial memory
        initial_memories = remove_duplicates(initial_memory)
        llm = ChatOpenAI(openai_api_key= secret_key , model_name="gpt-3.5-turbo", temperature=0)
        memory = ConversationSummaryBufferMemory(llm=llm, initial_memory=initial_memories)

        memory.save_context({"input": history_content}, {"output": "Thank you for providing me with information. Ask me anything about the said topic"})
        for conversation in initial_memories:
            if conversation['role'] == 'user':
                input_text = conversation['content']
            elif conversation['role'] == 'assistant':
                output_text = conversation['content']
                memory.save_context({"input": input_text}, {"output": output_text})

        conversation = ConversationChain(llm=llm,
                                         memory=memory,
                                         verbose=True)

        ai_response = conversation.predict(input=f"Can you answer my question or Do what I say directly: {user_message}?")

        # After getting the response, update the conversation context
        new_interaction = [
            {"role": "user", "content": user_message, "time": timezone.now().isoformat()},
            {"role": "assistant", "content": ai_response, "time": timezone.now().isoformat()}
        ]

        conversation_context.extend(new_interaction)

        # Deduplicate again to be safe
        conversation_context = remove_duplicates(conversation_context)

        # Update the Query object with the new context
        query.set_context(json.dumps(conversation_context))
        query.save()

        # Create a new SubQuery with the question and response
        subquery = SubQuery(question=user_message, response=ai_response)
        subquery.save()

        # Get the user from the reques
        
        user = request.user

        # Check if there's an existing query for this lesson and user combination
        try:
            existing_query = Query.objects.get(lesson=lesson, user=user)
            # Add the new SubQuery to the existing query's subqueries
            existing_query.add_subquery(subquery)
        except Query.DoesNotExist:
            # If no existing query, create a new one
            new_query = Query()
            new_query.set_lesson(lesson)
            new_query.set_user(user)
            new_query.add_subquery(subquery)
            new_query.save()

        
        #check if the question is related to any questions of the students by this topic

        # will check if the user_message is frequently asked
        # if the user_messagee is frequently asked it will create a FAQ and related-content row
        # the FAQ will also have the related-content-id (note: its possible to implement a multi relatinoal frequently asked question)

        #TODO Notify when FAQ reached specified amount
        faqs = Faq.objects.filter(lesson__id=lesson_id).values(
            'related_content__related_content_id',
            'related_content__general_context'
        ).annotate(count=Count('related_content__related_content_id')).order_by('-count')

        # Get the latest notification for this lesson
        latest_notification = Notification.objects.filter(lesson_id=lesson_id).order_by('-date_created').first()
        last_notified_count = latest_notification.last_notified_count if latest_notification else 0

        # Check if any count is a multiple of 10 and greater than last_notified_count
        for faq in faqs:
            if faq['count'] % 10 == 0 and faq['count'] > last_notified_count:
                lesson = Lesson.objects.get(id=lesson_id)
                Notification.objects.create(
                    lesson=lesson,
                    message=f"FAQ for lesson {lesson_id} has reached {faq['count']} related contents.",
                    is_read=False,
                    date_created=timezone.now(),
                    last_notified_count=faq['count']
                )
                break

        RelatedContentController.process_message_and_add_to_faq(lesson_id,user_message)


        #check
        # faq, created = Faq.objects.get_or_create(lesson=lesson,related_content=related_content_id, question=user_message)

        # if created:
        #     print("FAQ created for the lesson")
        # else:
        #     print("FAQ retrieved for the lesson")

        # # Append the new question to the existing FAQ questions
        # updated_question = f"{faq.question}\n{user_message}"
        # faq.question = updated_question
        # faq.save()
        # print("Updated FAQ:", faq.question)

        return JsonResponse({"response": ai_response})
    
    def llama_model(self, request, lesson_id, lesson_content_id):
        # Authenticate user
        # if not request.user.is_authenticated:
        #     return JsonResponse({"error": "User is not authenticated"}, status=401)
        
        try:
            body = json.loads(request.body)
            user_message = body.get('message')
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid request body")

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return JsonResponse({"error": "Lesson not found"}, status=404)

        try:
            lesson_content = LessonContent.objects.get(id=lesson_content_id, lesson=lesson)
            content_text = BeautifulSoup(lesson_content.get_contents(), 'html.parser').get_text()
        except LessonContent.DoesNotExist:
            return HttpResponseNotFound("Lesson content not found")

        user = request.user
        query, created = Query.objects.get_or_create(lesson=lesson, user=user)

        if query.context:
            try:
                conversation_context = json.loads(query.context)
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid conversation context data"}, status=400)
        else:
            conversation_context = []

        if created:
            past_conversation = []
        else:
            past_conversation = []
            for subquery in query.get_subqueries().order_by('created_at'):
                past_conversation.extend([
                    {"role": "user", "content": subquery.question, "time": subquery.created_at.isoformat()},
                    {"role": "assistant", "content": subquery.response, "time": subquery.created_at.isoformat()}
                ])

        lesson_title = lesson.get_title()
        lesson_subtitle = lesson.get_subtitle()
        # history_content = f"You are a helpful assistant that provides information based on the lesson provided only. Only answer in 2 sentences. If the question is not related to the lesson, then you can say that it is not related. Lesson Title: {lesson_title}\nSubtitle: {lesson_subtitle}\nContent: {content_text}"
        history_content = f"You are a helpful assistant that provides information based on the lesson provided only. Only answer in 2 sentences. If the question is not related to the lesson, then you can say that it is not related. Lesson Title: {lesson_title}\nSubtitle: {lesson_subtitle}"

        print("lesson_title ", lesson_title)
        print("lesson_subtitle ", lesson_subtitle)
        print("content_text", content_text)
        initial_memory = []
        # initial_memory = past_conversation + conversation_context
        print("past_conversation ",past_conversation)
        print("conversation_context ",conversation_context)

        def remove_duplicates(past_conversations):
            seen = set()
            cleaned_conversations = []
            for conversation in past_conversations:
                unique_key = (conversation['role'], conversation['content'], conversation['time'])
                if unique_key not in seen:
                    seen.add(unique_key)
                    cleaned_conversations.append(conversation)
            return cleaned_conversations
        
        # initial_memory = remove_duplicates(conversation_context)
        # initial_memory = remove_duplicates(initial_memory)

        # initial_memories = remove_duplicates(initial_memory)
        
        # BASE_URL = "http://localhost:11434/api/generate"
        BASE_URL = "http://localhost:11434/api/chat"
        # BASE_URL = "http://localhost:11434"

        # conversation_history = []
        # conversation_history.append(initial_memories)
        # conversation_history_json = json.dumps(conversation_history)
        # additional_string = " this is the question: "
        # complete_json = conversation_history_json + additional_string + user_message
        # full_prompt = "\n".join(conversation_history)
        body = json.loads(request.body)
        user_message = body.get('message')
        print(user_message)

        # actual_response = "this is the question: " + user_message
        actual_response = {
            "role": "user",
            "content": user_message
        }


        headers = {'Content-Type': 'application/json'}
        # data = {"model": "llama2",
        #         "stream": False,
        #         "prompt": complete_json}

        # data = {"model": "llama2",
        # "stream": False,
        # "prompt": actual_response}

        # chat
        data = {
            "model": "llama2",
            "messages": [
                {
                    "role": "system",
                    "content": history_content + "here is the question " + user_message
                },
                # actual_response
                # {
                #     "role": "user",
                #     "content": "5 + 2"
                # } 
            ],
            "stream": False,
        }

        # data = {
        #     "model": "llama2",
        #     "messages": [
        #         {
        #             "role": "system",
        #             # "content": "You are a helpful assistant. You will only answer questions related to Technopreneurship subject or course, if you encounter other context, just reply it is out of topic. Only reply with 2-3 sentences and straightforward answer."
        #             "content": history_content
        #         },
        #         actual_response
        #     ],
        #     "stream": False,
        # }

        response = requests.post(BASE_URL, headers=headers, data=json.dumps(data))
        # return JsonResponse({"response": "gwapo"})
        

        # response = completion(
        #     model="ollama_chat/llama2", 
        #     messages = [
        #         {
        #             "content": user_message,
        #             # "content": "You are a helpful assistant. You will only answer questions related to Technopreneurship subject or course, if you encounter other context, just reply it is out of topic. Only reply with 2-3 sentences and straightforward answer. question " + user_message,
        #             "role": "user",
        #         },
        #     ],
        #     # stream=False,
        #     # api_base=BASE_URL,

        # )
        print("response", response.text)
        if response.status_code == 200:
            response_json = response.json()
            response_text = response.text
            # actual_response = json.loads(response_text)["content"]
            actual_response = response_json["message"]["content"]
            # conversation_history.append(actual_response)
            #  # Update the Query object with the new context
            # query.set_context(json.dumps(user_message))
            # query.save()

            # # Create a new SubQuery with the question and response
            # subquery = SubQuery(question=user_message, response=actual_response)
            # subquery.save()

            # # Get the user from the request
            # user = request.user

            # # Check if there's an existing query for this lesson and user combination
            # try:
            #     existing_query = Query.objects.get(lesson=lesson, user=user)
            #     # Add the new SubQuery to the existing query's subqueries
            #     existing_query.add_subquery(subquery)
            # except Query.DoesNotExist:
            #     # If no existing query, create a new one
            #     new_query = Query()
            #     new_query.set_lesson(lesson)
            #     new_query.set_user(user)
            #     new_query.save()
            #     new_query.add_subquery(subquery)
            return JsonResponse({"response": actual_response})
        else:
            print("Error:", response.status_code, response.text)
            return None