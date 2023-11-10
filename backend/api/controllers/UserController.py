from django.contrib.auth.models import Group
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.serializer.UserSerializer import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from ..model.Student import Student

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from ..models import CustomUser


class UserController():
    @api_view(['POST'])
    def login(request):
        username = request.data.get('username', None)
        password = request.data.get('password', None)
        user = authenticate(username=username, password=password)

        if username is None or password is None:
            return Response({"message": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)
        if not user:
            return Response({"message": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)

        # Start building the response data
        response_data = {
            "token": token.key,
            "user": serializer.data
        }

        # If the user is a student, get the associated student data
        if user.role == 'student' and hasattr(user, 'student_profile'):
            student_data = {
                'course': user.student_profile.course,
                'year': user.student_profile.year
            }
            response_data['student_data'] = student_data

        return Response(response_data, status=status.HTTP_200_OK)

    @api_view(['POST'])
    def register(request):
        try:
            serializer = UserSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # If student, check if the course and year are provided.
            # If teacher, check if the course and year are not provided.
            if serializer.validated_data['role'] == 'student':
                if not request.data.get('course') or not request.data.get('year'):
                    return Response({"message": "Course and Year are required for students."},
                                    status=status.HTTP_400_BAD_REQUEST)
            elif serializer.validated_data['role'] == 'teacher':
                if 'course' in request.data or 'year' in request.data:
                    return Response({"message": "Course and Year should not be provided for teachers."},
                                    status=status.HTTP_400_BAD_REQUEST)

            # If all validations are passed, save the user
            user = serializer.save()

            if user.role == 'student':
                student_group, created = Group.objects.get_or_create(name='Student')
                Student.objects.create(user=user, course=request.data['course'], year=request.data['year'])
                user.groups.add(student_group)
            elif user.role == 'teacher':
                teacher_group, created = Group.objects.get_or_create(name='Teacher')
                user.groups.add(teacher_group)

            user.set_password(request.data['password'])
            user.save()

            token = Token.objects.create(user=user)
            response_data = {
                "token": token.key,
                "user": serializer.data,
            }

            if user.role == 'student':
                response_data['student_data'] = {
                    'course': request.data['course'],
                    'year': request.data['year']
                }

            return Response(response_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @api_view(['GET'])
    @authentication_classes([SessionAuthentication, TokenAuthentication])
    @permission_classes([IsAuthenticated])
    def test_token(request):
        return Response("passed for {}".format(request.user.email), status=status.HTTP_200_OK)

    @api_view(['GET'])
    def get_all_users(request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @api_view(['GET'])
    def get_user(request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
