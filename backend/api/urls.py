
from django.urls import path, re_path
from .controllers.UserController import UserController
from .controllers.LessonController import LessonController
from .controllers.LessonContentController import LessonContentsController
from .controllers.ChatBotController import ChatBotController
from .controllers.QueryController import QueryController
from .controllers.ImageController import ImageModelController
from .controllers.ImageMediaController import ImageMediaController
from .controllers.FileController import FileController


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

query_actions = {
    'get': 'getAllQueries',
    'post': 'createQuery',
}

query_detail_actions = {
    'get': 'getQueryById',
    'delete': 'deleteQuery',
}

image_actions = {
    'get': 'getAllImageById',
    'post': 'createImage',
}
image_detail_actions = {
    
    'get': 'getImageById',
    'put': 'updateImage',
    'delete': 'deleteImage',
}

image_media_actions = {
    'get': 'getAllImageMedia',
    'post': 'createImageMedia',
}
image_media_detail_actions = {
    'get': 'getImageMediaById',
    'put': 'updateImageMedia',
    'delete': 'deleteImageMedia',
}

file_actions = {
    'get': 'getAllFile',
    'post': 'createFile',
}
file_detail_actions = {
    'get': 'getAllFileByLessonId',
    'get': 'getFileById',
    'put': 'updateFile',
    'delete': 'deleteFile',
}

urlpatterns = [
    # Paths
    re_path('login', UserController.login),
    re_path('register', UserController.register),
    re_path('test-token', UserController.test_token),

    path('users/', UserController.get_all_users),
    path('users/<int:user_id>/', UserController.get_user),

    path('lessons/', LessonController.as_view(lesson_actions)),
    path('lessons/<int:lesson_id>', LessonController.as_view(lesson_detail_actions)),
    path('lessons/<int:lesson_id>/pages/', LessonContentsController.as_view(lesson_contents_actions)),
    path('lessons/<int:lesson_id>/pages/<int:lesson_contents_id>', LessonContentsController.as_view(lesson_contents_detail_actions)),
    path('lessons/<int:lesson_id>/chatbot/', ChatBotController.as_view({'post': 'chatbot_response'})),

    path('queries/', QueryController.as_view(query_actions)),
    path('queries/<int:pk>', QueryController.as_view(query_detail_actions)),

    # ImageMedia
    path('media/', ImageMediaController.as_view(image_media_actions)),
    path('media/create/', ImageMediaController.as_view(image_media_actions)),
    path('media/<int:pk>/', ImageMediaController.as_view(image_media_detail_actions)),
    path('media/update/<int:pk>/', ImageMediaController.as_view(image_media_detail_actions)),
    path('media/delete/<int:pk>/', ImageMediaController.as_view(image_media_detail_actions)),

    #File
    path('files/', FileController.as_view(file_actions)),
    path('lessons/<int:lesson_id>/files/create', FileController.as_view(file_actions)),
    path('lessons/<int:lesson_id>/files/',FileController.as_view(file_detail_actions)),
    path('files/<int:pk>/', FileController.as_view(file_detail_actions)),
    path('lessons/<int:lesson_id>/files/update/<int:pk>/', FileController.as_view(file_detail_actions)),
    path('lessons/<int:lesson_id>/files/delete/<int:pk>/', FileController.as_view(file_detail_actions)),

    # Add a URL pattern for image associated with a LessonContent
    path('lessons/<int:lesson_id>/pages/<int:lesson_content_id>/images/', ImageModelController.as_view(image_actions)),
    path('lessons/<int:lesson_id>/pages/<int:lesson_content_id>/images/', ImageModelController.as_view(image_detail_actions)),
    

    # Queries
    path('lessons', LessonController.as_view({'get': 'findLessonbyLessonNumber'})),
]
