from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CookieTokenObtainPairView, LogoutView, CreateNewTaskView, SignupView  # Importa las vistas personalizadas

urlpatterns = [
    # Login → obtiene access y refresh token
    path('api/login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Refrescar token
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup/', SignupView.as_view(), name='signup'),  # Incluye la URL de signup
    path('api/logout/', LogoutView.as_view(), name='logout'),  # Incluye la URL de logout
    path('api/', include('api_tasks.api.urls')),  # Incluye las URLs de la app task_managment
    path('api/create/', CreateNewTaskView.as_view(), name='create-task'),
]