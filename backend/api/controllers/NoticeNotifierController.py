# api/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, DestroyModelMixin
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from api.model.NoticeNotifier import NoticeNotifier
from api.model.Notification import Notification
from api.model.RelatedContent import RelatedContent
from api.model.Lesson import Lesson
from api.model.Teacher import Teacher  # Assuming you have a Teacher model with notification_threshold field
from api.serializer.NoticeNotifierSerializer import NoticeNotifierSerializer



class NoticeNotifierController(GenericViewSet, CreateModelMixin, ListModelMixin, RetrieveModelMixin, DestroyModelMixin):
    queryset = NoticeNotifier.objects.all()
    serializer_class = NoticeNotifierSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def add_faq_id_to_notice(notice_notifier, faq_id):
        if notice_notifier.faq_id_list:
            # If there are already IDs in the list, append the new ID
            updated_faq_id_list = notice_notifier.faq_id_list + ',' + str(faq_id)
        else:
            # If the list is empty, just set it to the new ID
            updated_faq_id_list = str(faq_id)

        notice_notifier.faq_id_list = updated_faq_id_list
        notice_notifier.save()
    def create_notice(self,lesson_id, related_content_id, faq_id):


        # Ensure the associated Lesson and RelatedContent exist
        lesson = Lesson.objects.filter(id=lesson_id).first()
        related_content = RelatedContent.objects.filter(related_content_id=related_content_id).first()

        if not lesson:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

        if not related_content:
            return Response({"error": "RelatedContent not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if a NoticeNotifier already exists for the given lesson and related_content
        notice_notifier = NoticeNotifier.objects.filter(lesson=lesson, related_content=related_content).first()

        if notice_notifier:
            # Update the current count
            notice_notifier.current_count += 1
            notice_notifier.save()

            notice_id = []
            notification_threshold = Teacher.objects.get(id=1).notification_threshold
            # Check if current count reached the notification threshold
            while (notice_notifier.current_count - notice_notifier.starting_count) >= notification_threshold:
                # Create the notification
                notification = Notification(
                    lesson=lesson,
                    message=f"Reached {notice_notifier.current_count} questions for lesson {lesson_id} and related content {related_content_id}.",
                    last_notified_count=notice_notifier.current_count
                )
                notification.save()

                # Set notice_notifier notification with the newly created notification
                notice_notifier.notification = notification

                # add to the return the notice id
                notice_id.append(notice_notifier.notice_id)

                # Update starting_count
                notice_notifier.starting_count += notification_threshold

                # add a data list
                self.add_faq_id_to_notice(notice_notifier, faq_id)


                # Save the updated starting_count to the db
                notice_notifier.save()


            return notice_id



            serializer = NoticeNotifierSerializer(notice_notifier)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Create a new NoticeNotifier
            notice_notifier = NoticeNotifier(
                notification=None,
                related_content=related_content,
                lesson=lesson,
                current_count=1,
                starting_count=0
            )
            notice_notifier.save()

            notification_threshold = Teacher.objects.get(id=1).notification_threshold
            # Check if current count reached the notification threshold
            if notice_notifier.current_count >= notification_threshold:
                # Create a new Notification
                notification = Notification(
                    lesson=lesson,
                    message=f"Reached {notice_notifier.current_count} questions for lesson {lesson_id} and related content {related_content_id}.",
                    last_notified_count=notice_notifier.current_count
                )
                notification.save()
                notice_notifier.notification = notification
                notice_notifier.save()

            serializer = NoticeNotifierSerializer(notice_notifier)
            return Response(serializer.data, status=status.HTTP_201_CREATED)