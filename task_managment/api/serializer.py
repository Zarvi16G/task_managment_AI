from rest_framework import serializers

from ..models import CustomUser

class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'birth_date', 'phone_number']