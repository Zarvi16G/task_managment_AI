from django.urls import path
from .views import SignUpView, ProtectedView, login_view, home
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Login → obtiene access y refresh token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Refrescar token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup/', SignUpView.as_view(), name='signup'),
    path('api/protected/', ProtectedView.as_view(), name='protected_view'),
    path('login/', login_view, name='token_login'),
    path('home/', home, name='home')
]

