
# from api.model.Faq import Faq

from api.model.Lesson import Lesson


from django.db import models

class RelatedContent(models.Model):
    related_content_id = models.AutoField(primary_key=True)
    is_generated = models.BooleanField(default=True)
    general_context = models.TextField(default="", null=False)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE,related_name='lesson')
    

    def __str__(self):
        return str(self.related_content_id)
    
    