from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')

        if isinstance(email, tuple) and len(email) == 1:
            email = email[0]
        elif isinstance(email, tuple):
            # O manejar el error si hay múltiples emails
            raise ValueError('Email cannot have multiple values.')
        if isinstance(password, tuple) and len(password) == 1:
            password = password[0]
        elif not isinstance(password, (str, bytes, type(None))):
             # Si después de verificar la tupla no es string ni bytes, lanzamos error
             raise TypeError("Password must be a string or bytes.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True) 
    username = None 
    phone_number = models.CharField(max_length=20, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups', # ÚNICO
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions', # ÚNICO
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
        
class Task(models.Model):
    task_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200, blank=True)
    completed = models.BooleanField(default=False)
    priority = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True)
    position = models.IntegerField(null=True)  # New field for ordering
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tasks')

    def __str__(self):
        return self.title