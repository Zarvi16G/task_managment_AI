from rest_framework import serializers
from rest_framework.serializers import Serializer
from django.contrib.auth import authenticate
from ..models import CustomUser, Task

class CreateUserSerializer(serializers.ModelSerializer):
    # 1. Campo de solo escritura (write_only) para la seguridad
    password = serializers.CharField(write_only=True, min_length=8) 

    class Meta:
        model = CustomUser
        # 2. Lista explícitamente solo los campos que el usuario va a ENVIAR
        fields = (
            'id', 
            'email', 
            'password', 
            'first_name', 
            'last_name', 
            'birth_date', 
            'phone_number'
        )
        
        # 3. Define la seguridad de los campos (no se devuelven en la respuesta)
        extra_kwargs = {
            'password': {'write_only': True} 
        }

    # 4. Sobreescribe el método create para usar el Manager y hashear la contraseña
    def create(self, validated_data):
        email=validated_data.pop('email'),
        password=validated_data.pop('password'),
        # Llama a tu método create_user del CustomUserManager (el más seguro)
        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            # Pasa el resto de los campos validados
            **validated_data 
        )
        return user
        
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['task_id', 'title', 'completed', 'priority', 'due_date', 'position', 'user']

class LoginUserSerializer(Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials!")
