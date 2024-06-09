from django.db import models

from api.model.Notification import Notification
from api.model.RelatedContent import RelatedContent
from api.model.Lesson import Lesson
from api.model.File import File


class GroupedQuestions(models.Model):
     grouped_question_id = models.AutoField(primary_key=True)
     lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='grouped_questions')
     related_content = models.ForeignKey(RelatedContent, on_delete=models.CASCADE, related_name='grouped_questions')
     notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='grouped_questions',null= True)
     notified = models.BooleanField(default=False,null=True)
