# api/serializers.py
from rest_framework import serializers
from api.model.Teacher import Teacher

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'  # Include all fields in the model
