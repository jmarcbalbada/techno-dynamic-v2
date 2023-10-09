import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import CustomUser
from api.serializer.UserSerializer import UserSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group

def create_teacher_user(username, password):
    try:
        # Create a new user with the "teacher" role
        user = CustomUser.objects.create(username=username, role='teacher')
        user.set_password(password)
        user.save()

        teacher_group, created = Group.objects.get_or_create(name='Teacher')
        user.groups.add(teacher_group)

        # Generate an authentication token for the user
        token, created = Token.objects.get_or_create(user=user)

        # Serialize the user data
        serializer = UserSerializer(instance=user)

        return {
            "token": token.key,
            "user": serializer.data,
            "message": "Teacher user created successfully."
        }
    except Exception as e:
        return {
            "error": str(e),
            "message": "Failed to create the teacher user."
        }


if __name__ == '__main__':
    username = 'teacher'
    password = 'teacher'

    result = create_teacher_user(username, password)

    if 'error' in result:
        print(f"Error: {result['error']}")
    else:
        print(result)
