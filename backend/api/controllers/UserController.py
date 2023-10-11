from django.contrib.auth.models import Group
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.serializer.UserSerializer import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from ..models import CustomUser

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class UserController():
    @api_view(['POST'])
    def login(request):
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        if username is None or password is None:
            return Response({"message": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({"message": "Username does not exist"}, status=status.HTTP_404_NOT_FOUND)

        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)

    @api_view(['POST'])
    def register(request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()

                # Check if the user's role is "student" or "teacher"
                if user.role == 'student':
                    student_group, created = Group.objects.get_or_create(name='Student')
                    user.groups.add(student_group)
                elif user.role == 'teacher':
                    teacher_group, created = Group.objects.get_or_create(name='Teacher')
                    user.groups.add(teacher_group)

                user.set_password(request.data['password'])
                user.save()
                token = Token.objects.create(user=user)
                return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @api_view(['GET'])
    @authentication_classes([SessionAuthentication, TokenAuthentication])
    @permission_classes([IsAuthenticated])
    def test_token(request):
        return Response("passed for {}".format(request.user.email), status=status.HTTP_200_OK)