from django.db import models
from accounts.models import CustomUser
from property.models import Property
# Create your models here.


class Reservation(models.Model):

    start = models.DateField()
    end = models.DateField()
    state = models.CharField(max_length=20, blank=True,
                             null=True)
    changed_states = models.BooleanField(default=True)
    host = models.ForeignKey(CustomUser, related_name='host', blank=True,
                             null=True, on_delete=models.SET_NULL)
    tenant = models.ForeignKey(CustomUser, related_name='tenant', blank=True,
                               null=True, on_delete=models.SET_NULL)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    creation_time = models.DateTimeField(auto_now_add=True)

    def cancel(self):
        if self.state == 'Pending':
            self.state = 'Canceled'
            self.changed_states = True
            self.save()
        if self.state == 'Approved':
            self.state = 'Canceling'
            self.changed_states = True
            self.save()

    def approve(self):
        if self.state == 'Pending':
            self.state = 'Approved'
            self.changed_states = True
            self.save()

    def deny(self):
        if self.state == 'Pending':
            self.state = 'Denied'
            self.changed_states = True
            self.save()

    def approve_canceling(self):
        if self.state == 'Canceling':
            self.state = 'Canceled'
            self.changed_states = True
            self.save()

    def deny_canceling(self):
        if self.state == 'Canceling':
            self.state = 'Approved'
            self.changed_states = True
            self.save()

    def terminate(self):
        if self.state == 'Approved':
            self.state = 'Terminated'
            self.changed_states = True
            self.save()
