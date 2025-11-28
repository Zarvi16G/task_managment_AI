from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework import status
from django.conf import settings
from .models import Task, CustomUser
from api_tasks.api.serializer import TaskSerializer, CreateUserSerializer, LoginUserSerializer


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request):
        cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE_REFRESH', 'refresh') 
        refresh_token = request.COOKIES.get(cookie_name)
        print("se esta activando cookierefresfview")
        if not refresh_token:
            return Response({"error":"Refresh token not provided"}, status= status.HTTP_401_UNAUTHORIZED)
    
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            print(access_token)
            
            response = Response({"message": "Access token token refreshed successfully"}, status=status.HTTP_200_OK)
            response.set_cookie(key=settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access'),
                                value=access_token,
                                httponly=True,
                                secure=True,
                                samesite="None")
            return response
        except InvalidToken:
            return Response({"error":"Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

class LoginView(APIView):
    authentication_classes = ()
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginUserSerializer(data=request.data)
        
        print("activando login")
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            response = Response({
                "user": CreateUserSerializer(user).data},
                                status=status.HTTP_200_OK)
            
            response.set_cookie(key=settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access'),
                                value=access_token,
                                httponly=True,
                                secure=True,
                                samesite="None")
            
            response.set_cookie(key=settings.SIMPLE_JWT.get('AUTH_COOKIE_REFRESH', 'refresh'),
                                value=str(refresh),
                                httponly=True,
                                secure=True,
                                samesite="None")
            return response
        return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        permission_classes = [IsAuthenticated]
        try:
            new_task = Task.objects.create(
                title="Nueva Tarea Sin Título",
                user=request.user,
            )
            serializer = TaskSerializer(new_task)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
             print(f"Error durante la creación: {e}")
             return Response({"detail": "Error interno del servidor."}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetUser(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateUserSerializer

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        user_pk = self.kwargs['pk']
        try:
            instance = CustomUser.objects.get(pk=user_pk)
        except CustomUser.DoesNotExist:
            return Response({"detail": "No encontrado."}, status=status.HTTP_404_NOT_FOUND)

        print("Datos recibidos (PATCH):", request.data) 
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        print("Errores del Serializador:", serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)