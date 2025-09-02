from django.db import models
from django.contrib.auth.models import User, AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.username