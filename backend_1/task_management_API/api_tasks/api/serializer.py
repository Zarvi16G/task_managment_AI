from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework.response import Response
from django.conf import settings

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

class CookieTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Sobreescribe el serializer para enviar tokens como cookies HttpOnly.
    """
    
    @classmethod
    def get_token(cls, user):
        # Llama a la lógica base para crear los tokens Access y Refresh
        return super().get_token(user)

    def validate(self, attrs):
        # Llama al validate base para obtener los tokens en la respuesta
        data = super().validate(attrs)

        self.access_token = data.get('access')
        self.refresh_token = data.get('refresh')
        
        # Eliminar los tokens del cuerpo JSON de la respuesta
        del data['access']
        del data['refresh']
        
        # Añadir un mensaje de éxito para que el frontend sepa que funcionó
        data['success'] = 'Login exitoso' 
        
        return data

# Función utilitaria para configurar las cookies
def jwt_set_cookie(response, token, cookie_name, max_age):
    """Establece la cookie con los parámetros HttpOnly y Secure."""
    response.set_cookie(
        key=cookie_name,
        value=token,
        max_age=max_age,
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
    )