from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    password=models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff=None
    is_superuser=None
    last_login=None
    REQUIRED_FIELDS = [first_name,last_name]