from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from api_tasks.api.serializer import CookieTokenObtainPairSerializer, jwt_set_cookie, TaskSerializer, CreateUserSerializer
from .models import Task, CustomUser
from rest_framework import status

# --- 1. Vista de LOGIN personalizada ---
class CookieTokenObtainPairView(TokenObtainPairView):
    """Vista que maneja el login y establece los tokens en cookies."""
    serializer_class = CookieTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            print("Request data received for login:", request.data)
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({'detail': str(e)}, status=400)

        # La data contiene solo el mensaje de éxito (sin tokens)
        response = Response(serializer.data, status=200)
        print("Serializer data after validation:", serializer.data)

        # 💥 Establece las cookies en la respuesta HTTP
        access_token = serializer.access_token
        refresh_token = serializer.refresh_token
        
        jwt_set_cookie(
            response, 
            access_token, 
            settings.SIMPLE_JWT['AUTH_COOKIE'], 
            settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
        )
        jwt_set_cookie(
            response, 
            refresh_token, 
            settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], 
            settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
        )

        return response

class SignupView(APIView):
    """Vista para registrar nuevos usuarios."""
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        try:
            data = request.data
            serializer = CreateUserSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"detail": "Usuario creado exitosamente."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error durante el registro: {e}")
            return Response({"detail": "Error interno del servidor."}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- 2. Vista de LOGOUT personalizada ---
class LogoutView(APIView):
    """Vista que elimina las cookies para cerrar la sesión."""
    def post(self, request):
        response = Response({"detail": "Sesión cerrada correctamente."}, status=200)
        
        # 💥 Borra la cookie de acceso
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        # 💥 Borra la cookie de refresco
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        
        return response

class CreateNewTaskView(APIView):
    def post(self, request, format=None):
        #user instance for testing purpose
        user =  CustomUser.objects.create(id=2, email='testing@mail.com', first_name='Test', last_name='User', birth_date=('2025-11-11'), phone_number='1234567890')
        permission_classes = [IsAuthenticated]
        try:
            new_task = Task.objects.create(
                title="Nueva Tarea Sin Título",
                user=user
                # user=request.user, # Descomentar en un entorno real donde request.user esté disponible
            )
            serializer = TaskSerializer(new_task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
             print(f"Error durante la creación: {e}")
             return Response({"detail": "Error interno del servidor."}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)