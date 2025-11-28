from rest_framework import viewsets
# Viewsets is the way to create views in DRF
from ..models import Task
from .serializer import TaskSerializer, CreateUserSerializer
from rest_framework.permissions import IsAuthenticated

class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        tasks = Task.objects.filter(user=user.id)
        return  tasks

