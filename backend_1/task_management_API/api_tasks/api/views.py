from rest_framework import viewsets
# Viewsets is the way to create views in DRF
from ..models import CustomUser, Task
from .serializer import TaskSerializer
from rest_framework.permissions import IsAuthenticated

class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

