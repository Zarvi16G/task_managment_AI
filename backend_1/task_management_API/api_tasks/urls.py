from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import LoginView, LogoutView, CreateNewTaskView, SignupView, GetUser  # Importa las vistas personalizadas

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/signup/', SignupView.as_view(), name='signup'),  # Incluye la URL de signup
    path('api/logout/', LogoutView.as_view(), name='logout'),  # Incluye la URL de logout
    path('api/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/', include('api_tasks.api.urls')),  # Incluye las URLs de la app task_managment
    path('api/user/', GetUser.as_view(), name='user' ),
    path('api/user/<int:pk>/', GetUser.as_view(), name='update_user' ),
    path('api/create/', CreateNewTaskView.as_view(), name='create-task'),
]