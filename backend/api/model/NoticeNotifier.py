from django.utils import timezone
from django.db import models
from api.model.Notification import Notification
from api.model.RelatedContent import RelatedContent
from api.model.Lesson import Lesson


class NoticeNotifier(models.Model):
    notice_id = models.AutoField(primary_key=True)
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='notices', null=True)
    related_content = models.ForeignKey(RelatedContent, on_delete=models.CASCADE, related_name='notices')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='notices')

    # store all faq base on the index
    faq_id_list = models.TextField()

    # count of all questions that is under on the same lesson and has same context (related_content)
    current_count = models.IntegerField(default=0, null=True, blank=True)

    # will store the value of the count that have already been notified
    starting_count = models.IntegerField(default=0, null=True, blank=True)
