from django.contrib import admin
from .model.Lesson import Lesson
from .model.LessonContent import LessonContent
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .model.Student import Student
from .model.Query import Query
from .model.SubQuery import SubQuery
from .model.ImageModel import ImageModel
from .model.ImageMedia import ImageMedia
from .model.File import File
from .model.ContentHistory import ContentHistory

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff',
                    'role')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

# Register your model here.
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Student)
admin.site.register(Lesson)
admin.site.register(LessonContent)
admin.site.register(Query)
admin.site.register(SubQuery)
admin.site.register(ImageModel)
admin.site.register(ImageMedia)
admin.site.register(File)
admin.site.register(ContentHistory)

