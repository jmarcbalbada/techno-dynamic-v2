from django.urls import path, re_path
from .controllers.UserController import UserController
from .controllers.LessonController import LessonController
from .controllers.LessonContentController import LessonContentsController

lesson_actions = {
    'get': 'getAllLessons',
    'post': 'createLesson',
}

lesson_detail_actions = {
    'get': 'getLessonById',
    'put': 'updateLesson',
    'patch': 'patchLesson',
    'delete': 'deleteLesson',
}

lesson_contents_actions = {
    'get': 'getAllLessonContents',
    'post': 'createLessonContents',
}

lesson_contents_detail_actions = {
    'get': 'getLessonContentsById',
    'put': 'updateLessonContents',
    'patch': 'patchLessonContents',
    'delete': 'deleteLessonContents',
}

urlpatterns = [
    # Paths
    re_path('login', UserController.login),
    re_path('register', UserController.register),
    re_path('test-token', UserController.test_token),
    path('lessons/', LessonController.as_view(lesson_actions)),
    path('lessons/<int:lesson_id>', LessonController.as_view(lesson_detail_actions)),
    path('lessons/<int:lesson_id>/pages/', LessonContentsController.as_view(lesson_contents_actions)),
    path('lessons/<int:lesson_id>/pages/<int:lesson_contents_id>', LessonContentsController.as_view(lesson_contents_detail_actions)),

    # Queries
    path('lessons', LessonController.as_view({'get': 'findLessonbyLessonNumber'})),
]