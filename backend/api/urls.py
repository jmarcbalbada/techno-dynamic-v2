from django.urls import path
from .controllers.LessonController import LessonController
from .controllers.LessonContentController import LessonContentsController

lesson_actions = {
    'get': 'getAllLessons',
    'post': 'createLesson',
}

lesson_detail_actions = {
    'get': 'getLessonById',
    'put': 'updateLesson',
    'delete': 'deleteLesson',
}

lesson_contents_actions = {
    'get': 'getAllLessonContents',
    'post': 'createLessonContents',
}

lesson_contents_detail_actions = {
    'get': 'getLessonContentsById',
    'put': 'updateLessonContents',
    'delete': 'deleteLessonContents',
}

urlpatterns = [
     path('lessons/', LessonController.as_view(lesson_actions)),
     path('lessons/<int:lesson_id>', LessonController.as_view(lesson_detail_actions)),
     path('lessons/<int:lesson_id>/pages/', LessonContentsController.as_view(lesson_contents_actions)),
     path('lessons/<int:lesson_id>/pages/<int:lesson_contents_id>', LessonContentsController.as_view(lesson_contents_detail_actions))
]