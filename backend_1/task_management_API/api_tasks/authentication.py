# from rest_framework_simplejwt.authentication import JWTAuthentication
# from django.conf import settings

# class CustomCookieJWTAuthentication(JWTAuthentication):
#     """
#     Custom authentication class that looks for the JWT Access Token in the
#     HttpOnly cookie instead of the Authorization header.
#     """
#     def get_header(self, request):
#         """
#         Extracts the Access Token from the request's cookies.
#         """
#         # 1. Check if the access token cookie exists
#         raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        
#         if raw_token is None:
#             # If not found in cookie, fall back to checking the header
#             return super().get_header(request)
#         # 2. If found, format it as a standard 'Bearer <token>' header 
#         # so the parent JWTAuthentication class can process it.
#         return self.get_jwt_value(raw_token)

#     def authenticate(self, request):
#     # We need to save the request object to access COOKIES in get_raw_token
#         self.request = request 
#         print("Authenticating request with cookies:", request.COOKIES)
    
#     # Call the base authenticate method which relies on get_raw_token
#         return super().authenticate(request)   
        
    
#     def authenticate_header(self, request):
#         return None

#     # We need to override get_jwt_value to handle the raw token itself
#     def get_jwt_value(self, raw_token):
#         return raw_token

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
            # Si no hay token en la cookie, intentamos autenticación por header 
            # (para la interfaz admin o pruebas) o simplemente devolvemos None.
            # Aquí, solo delegamos al método base para que revise el encabezado si es necesario.
            # O simplemente retornamos None si queremos que solo funcione con cookies:
            return None 

        try:
            # 2. VALIDACIÓN: Usar la clase AccessToken de simplejwt para validar la firma y expiración.
            validated_token = AccessToken(raw_token)
            
            # 3. OBTENER USUARIO: Usar el método base para obtener el usuario del token validado.
            user = self.get_user(validated_token)
            
            # 4. ÉXITO: Devolver la tupla (usuario, token validado).
            if user is not None:
                return (user, validated_token)
            
        except InvalidToken as e:
            # 5. FALLA: El token es inválido o expiró. 
            # Imprimir el error es crucial para el debugging.
            print(f"Token JWT inválido o expirado: {e}")
            pass # Dejamos que la autenticación falle (devuelve None).
        
        # Si la cookie existe pero el token es inválido o el usuario no se encuentra, 
        # devolvemos None, resultando en AnonymousUser.
        return None
        
    def authenticate_header(self, request):
        # Evitamos que Django pida el encabezado "Bearer"
        return None