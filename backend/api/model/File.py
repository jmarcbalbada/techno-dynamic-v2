from django.db import models


class File(models.Model):
    file = models.FileField(upload_to='files')
    lesson = models.ForeignKey('api.Lesson', on_delete=models.CASCADE, related_name='lesson_files', null=True, blank=True)

    def __str__(self):
        return str(self.id)
