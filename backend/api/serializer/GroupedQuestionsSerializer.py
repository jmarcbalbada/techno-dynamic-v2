# serializers.py

from rest_framework import serializers
from api.model.GroupedQuestions import GroupedQuestions

class GroupedQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupedQuestions
        fields = '__all__'
