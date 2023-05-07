from django.db import models
from accounts.models import CustomUser


# Create your models here.
class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('RATING', 'Rating'),
        ('COMMENT', 'Comment'),
        ('RESERVATION_REQUEST', 'Reservation Request'),
        ('RESERVATION_APPROVAL', 'Reservation Approval'),
        ('RESERVATION_CANCELLATION', 'Reservation Cancellation'),
        ('RESERVATION_DENIAL', 'Reservation Denial'),
        ('UPCOMING_RESERVATION', 'Upcoming Reservation'),
        ('CANCELING_APPROVAL', 'Canceling Approval'),
        ('CANCELING_DENIAL', 'Canceling Denial'),
        ('RESERVATION_TERMINATION', 'Reservation Termination'),
    )
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    sender = models.ForeignKey(CustomUser, related_name='notification_sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='notification_receiver', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    message = models.CharField(max_length=200, blank=True, null=True)

