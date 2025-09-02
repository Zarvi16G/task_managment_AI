from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth import authenticate, login

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication

# Create your views here.
class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"

def login_view(API_View):
    username = API_View.POST["username"]
    password = API_View.POST["password"]
    user = authenticate(API_View, username=username, password=password)
    if user is not None:
        # Redirect to a success page.
        login(API_View, user)
    else:
        # Return an 'invalid login' error message.
        content = {'error': 'Invalid credentials'}
        return Response(content, status=401)

def home(request):
    return render(request, "index.html")



class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'This is a protected view!'}
        return Response(content)