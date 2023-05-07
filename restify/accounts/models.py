from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db.models import CASCADE
# Create your models here.

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True, default='')
    avatar = models.ImageField(upload_to=upload_to, blank=True, null=True)
  