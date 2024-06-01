# api/serializers.py
from rest_framework import serializers
from api.model.TeacherProfile import TeacherProfile

class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = '__all__'  # Include all fields in the model
