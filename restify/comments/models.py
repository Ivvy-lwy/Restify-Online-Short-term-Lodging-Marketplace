from django.db import models
from accounts.models import CustomUser
from property.models import Property
from reservations.models import Reservation
# Create your models here.


class Comment(models.Model):
    RATE = [
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
    ]
    host = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, blank=True,
                             null=True, related_name='c_host')
    tenant = models.ForeignKey(CustomUser, on_delete=models.SET_NULL,
                               blank=True, null=True, related_name='c_tenant')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    new_comment = models.BooleanField(default=True)
    rating = models.IntegerField(choices=RATE, blank=True, null=True,)
    reservation = models.ForeignKey(Reservation, on_delete=models.SET_NULL,
                                    blank=True, null=True, )


class CommentForProperty(Comment):
    property = models.ForeignKey(Property, on_delete=models.SET_NULL,
                                 blank=True, null=True, )
    comment_ptr = models.OneToOneField(
        Comment, on_delete=models.CASCADE, parent_link=True, default=None,
    )
    is_reply = models.BooleanField(default=None, null=True, blank=True)
    comment_num = models.IntegerField(default=None, null=True, blank=True)
