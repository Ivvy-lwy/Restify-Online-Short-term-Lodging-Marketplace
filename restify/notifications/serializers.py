from rest_framework.serializers import ModelSerializer
from .models import Notification


class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


################### Only used for testing   ##############
class NotificationCreateSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'sender', 'receiver', 'type', 'message']
