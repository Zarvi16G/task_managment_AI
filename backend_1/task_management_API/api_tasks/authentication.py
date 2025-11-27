from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings

class CustomCookieJWTAuthentication(JWTAuthentication):
    """
    Controla explícitamente el flujo de autenticación para leer la cookie.
    """
    
    def authenticate(self, request):
        # 1. Intentar obtener el token de la cookie
        cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access') 
        raw_token = request.COOKIES.get(cookie_name)

        if raw_token is None:
            return None 

        try:
            validated_token = AccessToken(raw_token)
            
            # 3. OBTENER USUARIO: Usar el método base para obtener el usuario del token validado.
            user = self.get_user(validated_token)
            
            # 4. ÉXITO: Devolver la tupla (usuario, token validado).
            if user is not None:
                return (user, validated_token)
            
        except InvalidToken as e:
            print(f"Token JWT inválido o expirado: {e}")
            pass # Dejamos que la autenticación falle (devuelve None).
        
        return None
        
    def authenticate_header(self, request):
        # Evitamos que Django pida el encabezado "Bearer"
        return None

