from rest_framework import serializers
from api.model.Query import Query
from api.serializer.SubQuerySerializer import SubQuerySerializer

class QuerySerializer(serializers.ModelSerializer):
    subqueries = SubQuerySerializer(many=True, read_only=True)
    context = serializers.CharField(read_only=True)

    class Meta:
        model = Query
        fields = ('id', 'lesson', 'user', 'subqueries', 'context')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['lesson'] = {
            'id': instance.lesson.id,
            'lessonNumber': instance.lesson.lessonNumber,
            'title': instance.lesson.title,
            'subtitle': instance.lesson.subtitle,
        }
        representation['user'] = {
            'id': instance.user.id,
            'username': instance.user.username,
            'first_name': instance.user.first_name,
            'last_name': instance.user.last_name,
            'role': instance.user.role,
        }

        # Check if the user's role is "student" and if there is a related student instance
        if instance.user.role == "student" and hasattr(instance.user, 'student_profile'):
            student = instance.user.student_profile
            representation['user']['course'] = student.course
            representation['user']['year'] = student.year

        return representation