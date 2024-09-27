
from django.urls import path, re_path,include

from .controllers.GroupedQuestionsController import GroupedQuestionsController
from .controllers.TeacherController import TeacherController
from .controllers.UserController import UserController
from .controllers.LessonController import LessonController
from .controllers.LessonContentController import LessonContentsController
from .controllers.ChatBotController import ChatBotController
from .controllers.QueryController import QueryController
from .controllers.ImageController import ImageModelController
from .controllers.ImageMediaController import ImageMediaController
from .controllers.FileController import FileController
from .controllers.FaqController import FaqController
from .controllers.SuggestionController import SuggestionController
from .controllers.RelatedContentController import RelatedContentController
from .controllers.NotificationController import NotificationController
from .controllers.ContentHistoryController import ContentHistoryController
from rest_framework.routers import SimpleRouter


content_detail_actions = {
    'post': 'create',
    'put': 'update',
    'delete': 'destroy',
}

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

content_historyWithLessonId_actions = {
    'post': 'createHistory',
    'get': 'getAllHistoryByLessonId',
}

content_historyWithLessonsIdAndHistoryId_actions = {
    'put': 'restoreHistory',
}

content_historyWithHistoryId_actions = {
    'get': 'getHistoryByHistoryId',

}

content_historyAdminControls_actions = {
    'put': 'updateHistory',
    'delete': 'deleteHistory',
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
}
file_detail_actions = {
    'get': 'getAllFileByLessonId',
    #'get': 'getFileById',
    'post': 'createFile',
    'put': 'updateFile',
    'delete': 'deleteFile',
}

faq_detail_actions = {
    'get': 'get_questions_by_lesson_id',
}

notification_detail_actions = {
    'get': 'get_all_count_unread_notif',
    'delete': 'deleteNotification',
}

suggestion_detail_actions = {
    'put': 'updateContent',
    'delete': 'deleteSuggestionByLessonId',
}

suggestion_revert_actions = {
    'put': 'updateRevertContent',
}

suggestion_insight_actions = {
  'post': 'createInsight'
}

suggestion_content_actions = {
  'post': 'createContent'
}

APPEND_SLASH = True

# Routers
routes = SimpleRouter()
routes.register('faqs', FaqController)
routes.register('teacher', TeacherController)
routes.register('questions', GroupedQuestionsController)
routes.register('notification', NotificationController)
urlpatterns = [

    path('', include(routes.urls)),
    # Paths
    re_path('login', UserController.login),
    re_path('register', UserController.register),
    re_path('test-token', UserController.test_token),

    # Users
    path('users/', UserController.get_all_users),
    path('users/setOpt/', UserController.as_view({'put': 'setOptInUserById'})),
    path('users/getOpt/<int:user_id>/', UserController.as_view({'get': 'getOptInUserById'})),
    path('users/<int:user_id>/', UserController.get_user),

    path('lessons/', LessonController.as_view(lesson_actions)),
    path('lessons/<int:lesson_id>', LessonController.as_view(lesson_detail_actions)),
    path('lessons/<int:lesson_id>/pages/', LessonContentsController.as_view(lesson_contents_actions)),
    path('lessons/<int:lesson_id>/pages/<int:lesson_contents_id>', LessonContentsController.as_view(lesson_contents_detail_actions)),
    path('lessons/<int:lesson_id>/pages/<int:lesson_content_id>/chatbot/', ChatBotController.as_view({'post': 'chatbot_response'})),

    # History
    path('lessons/history/lesson/<int:lesson_id>/', ContentHistoryController.as_view(content_historyWithLessonId_actions)),
    path('lessons/history/history/<int:history_id>/', ContentHistoryController.as_view(content_historyWithHistoryId_actions)),
    path('lessons/history/adminControl/<int:lesson_id>/<int:history_id>/', ContentHistoryController.as_view(content_historyAdminControls_actions)),
    path('lessons/history/restore/<int:lesson_id>/<int:history_id>/', ContentHistoryController.as_view(content_historyWithLessonsIdAndHistoryId_actions)),

    # Queries
    path('queries/', QueryController.as_view(query_actions)),
    path('queries/<int:pk>/', QueryController.as_view(query_detail_actions)),

    # ImageMedia
    path('media/', ImageMediaController.as_view(image_media_actions)),
    path('media/create/', ImageMediaController.as_view(image_media_actions)),
    path('media/<int:pk>/', ImageMediaController.as_view(image_media_detail_actions)),
    path('media/update/<int:pk>/', ImageMediaController.as_view(image_media_detail_actions)),
    path('media/delete/<int:pk>/', ImageMediaController.as_view(image_media_detail_actions)),

    #File
    path('files/', FileController.as_view(file_actions)),
    path('lessons/<int:lesson_id>/files/',FileController.as_view(file_detail_actions)),
    path('lessons/<int:lesson_id>/files/create', FileController.as_view(file_detail_actions)),
    #path('files/<int:pk>/', FileController.as_view(file_detail_actions)),
    path('lessons/<int:lesson_id>/files/update/<int:pk>/', FileController.as_view(file_detail_actions)),
    path('lessons/<int:lesson_id>/files/delete/<int:pk>/', FileController.as_view(file_detail_actions)),

    # Add a URL pattern for image associated with a LessonContent
    path('lessons/<int:lesson_id>/pages/<int:lesson_content_id>/images/', ImageModelController.as_view(image_actions)),
    path('lessons/<int:lesson_id>/pages/<int:lesson_content_id>/images/', ImageModelController.as_view(image_detail_actions)),
    
    # RelatedContents
    path('test/related/', RelatedContentController.as_view({'post': 'process_message_and_add_to_faq'})),

    # Queries
    path('lessons', LessonController.as_view({'get': 'findLessonbyLessonNumber'})),

    # Faq
    path('faqs/', FaqController.as_view(faq_detail_actions)),

    # Notification
    path('notification/getUnread', NotificationController.as_view({'get': 'get_all_notification'})),
    path('notification/', NotificationController.as_view(notification_detail_actions)),

    # Suggestions
    path('suggestions/', SuggestionController.as_view(suggestion_detail_actions)),
    path('suggestions/getoldcontent/<int:lesson_id>', SuggestionController.as_view({'get': 'getOldContent'})),
    path('suggestions/revert/', SuggestionController.as_view(suggestion_revert_actions)),

    path('suggestions/insights/', SuggestionController.as_view(suggestion_insight_actions)),
    path('suggestions/contents/', SuggestionController.as_view(suggestion_content_actions)),
    
    # Get suggestions by lesson ID
    path('lessons/<int:lesson_id>/suggestions/', SuggestionController.as_view({'get': 'list'})),

]
