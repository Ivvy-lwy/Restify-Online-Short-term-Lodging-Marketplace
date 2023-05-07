from django.db import models
from accounts.models import CustomUser
import datetime

# Create your models here.

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class Property(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    guest = models.PositiveIntegerField()
    bedroom = models.PositiveIntegerField()
    bed = models.PositiveIntegerField()
    bathroom = models.PositiveIntegerField()
    price = models.PositiveIntegerField(default=0)
    # start_date = models.DateField(blank=True, null=True)
    # end_date = models.DateField(blank=True, null=True)
    #image = models.ImageField(blank=True, null=True)
    owner = models.ForeignKey(CustomUser, related_name='property_owner',
                              null=True, on_delete=models.SET_NULL,
                              blank=True)
    rating = models.FloatField(default=0.0)
    rating_num = models.PositiveIntegerField(default=1)


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='property_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_to, blank=True, null=True)

class Price(models.Model):
    property = models.ForeignKey(Property, related_name='price_periods', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.PositiveIntegerField()

    class Meta:
        ordering = ['start_date']