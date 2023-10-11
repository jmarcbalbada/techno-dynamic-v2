from django.contrib import admin
from .model.Lesson import Lesson
from .model.LessonContent import LessonContent
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .model.Student import Student

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
