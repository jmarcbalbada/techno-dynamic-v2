from rest_framework import serializers
from api.model.SubQuery import SubQuery

class SubQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubQuery
        fields = ('question', 'response', 'created_at' )
