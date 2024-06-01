from api.model.Faq import Faq
from api.model.RelatedContent import RelatedContent
from django.db import models

class Content(models.Model):
    faq = models.ForeignKey(Faq, on_delete=models.CASCADE, related_name='contents')
    related_content = models.ForeignKey(RelatedContent, on_delete=models.CASCADE, related_name='contents')
    content = models.TextField()

    def __str__(self):
        return self.content[:50]
