from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.serializer.UserSerializer import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from ..models import CustomUser

from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class UserController():
    @api_view(['POST'])
    def login(request):
        user = get_object_or_404(CustomUser, username=request.data['username'])
        if not user.check_password(request.data['password']):
            return Response({"message": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        return Response({"token": token.key, "user": serializer.data})

    @api_view(['POST'])
    def register(request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = CustomUser.objects.get(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()
            token = Token.objects.create(user=user)
            return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['GET'])
    @authentication_classes([SessionAuthentication, TokenAuthentication])
    @permission_classes([IsAuthenticated])
    def test_token(request):
        return Response("passed for {}".format(request.user.email))