from django.shortcuts import render
from .utils import process_message_and_add_to_faq

def some_view(request):
    message = "What is the meaning of life?"
    lesson_id = 1  # Replace with actual lesson_id
    result = process_message_and_add_to_faq(message, lesson_id)
    return render(request, 'some_template.html', {'result': result})