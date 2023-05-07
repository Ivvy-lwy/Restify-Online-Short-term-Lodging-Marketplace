from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import ListAPIView, get_object_or_404, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer, NotificationCreateSerializer


# Create your views here.
class NotificationView(RetrieveAPIView, UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_object(self):
        user = self.request.user
        notification = get_object_or_404(Notification, id=self.kwargs['pk'], receiver=user.id)
        return notification


class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(receiver=user.id).order_by('timestamp')
        return queryset


class NotificationDeleteView(DestroyAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_object(self):
        user = self.request.user
        notification = Notification.objects.filter(id=self.kwargs['pk'], receiver=user.id)
        return notification

    def delete(self, request, *args, **kwargs):
        self.destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_204_NO_CONTENT)


class NotificationDeleteAllView(DestroyAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        queryset = Notification.objects.filter(receiver=user.id)
        return queryset

    def delete(self, request, *args, **kwargs):
        print('delete all')
        self.destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_204_NO_CONTENT)


################### Only used for testing   ##############
class NotificationCreateView(ListAPIView):
    serializer_class = NotificationCreateSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = NotificationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # serializer.save(sender=request.user)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(receiver=user.id).order_by('timestamp')
        return queryset
