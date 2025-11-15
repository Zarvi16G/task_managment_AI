from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

# router is the urls creator for the TaskViewSet
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
urlpatterns = router.urls