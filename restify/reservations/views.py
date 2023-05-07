from django.utils import timezone
from django.shortcuts import get_list_or_404, render
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from accounts.models import CustomUser
from notifications.models import Notification
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Reservation
from .serializers import *
from rest_framework.response import Response
from rest_framework import generics, status
# Create your views here.


# https://www.django-rest-framework.org/api-guide/filtering/
class ReservationStateListView(ListAPIView):
    serializer_class = ReservationListSerializer

    # filter by state
    def get_queryset(self):
        if self.kwargs['person'].lower() == "tenant":
            queryset = Reservation.objects.filter(
                state=self.kwargs['state'].lower().capitalize(),
                tenant=self.request.user)
        elif self.kwargs['person'].lower() == "host":
            queryset = Reservation.objects.filter(
                state=self.kwargs['state'].lower().capitalize(),
                host=self.request.user)
        else:
            raise ValidationError({'error': 'bad request'})
        return queryset


class AllowAllGet(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class ReservationList(ListAPIView):
    serializer_class = ReservationListSerializer
    pagination_class = None
    permission_classes = [AllowAllGet]

    def get_queryset(self):
        queryset = Reservation.objects.filter(
            Q(state='Pending') | Q(state='Approved') | Q(state='Canceling'),
            property_id=self.kwargs['p_id'])
        return queryset

class ReservationUserListView(ListAPIView):
    serializer_class = ReservationListSerializer

    # filter by state
    def get_queryset(self):
        s = self.kwargs['type'].lower()
        if s == 'guest':
            queryset = Reservation.objects.filter(tenant=self.request.user)
        elif s == 'host':
            queryset = Reservation.objects.filter(host=self.request.user)
        else:
            return Response({'error': 'bad request'},
                            status=status.HTTP_400_BAD_REQUEST)
        queryset = get_list_or_404(queryset)
        return queryset


class CreateReservation(CreateAPIView):
    serializer_class = ReservationCreateSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # send notification to host
            host = CustomUser.objects.get(username=serializer.data['host_name'])
            notification = Notification.objects.create(
                sender=request.user,
                receiver=host,
                type='RESERVATION_REQUEST',
                message=f'{request.user.username} has made a new reservation request '
                        f'from {serializer.data["start"]} to {serializer.data["end"]}'
            )
            notification.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeState(generics.UpdateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationCancelSerializer

    def update(self, request, *args, **kwargs):
        reservation = self.get_object()
        serializer = self.get_serializer(reservation)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class CancelReservation(ChangeState):
    def update(self, request, *args, **kwargs):
        reservation = self.get_object()
        if self.request.user != reservation.tenant:
            return Response({'error': 'bad request'},
                            status=status.HTTP_400_BAD_REQUEST)
        reservation.cancel()
        serializer = self.get_serializer(reservation)

        # send notification to host
        host = CustomUser.objects.get(username=serializer.data['host_name'])
        notification = Notification.objects.create(
            sender=request.user,
            receiver=host,
            type='RESERVATION_CANCELLATION',
            message=f'{request.user.username} has canceled a reservation '
        )
        notification.save()

        return Response(serializer.data)


class ApproveReservation(ChangeState):
    def update(self, request, *args, **kwargs):
        reservation = self.get_object()
        if self.request.user != reservation.host:
            return Response({'error': 'bad request'},
                            status=status.HTTP_400_BAD_REQUEST)
        reservation.approve()
        serializer = self.get_serializer(reservation)

        # send notification to guest
        guest = CustomUser.objects.get(username=serializer.data['tenant_name'])
        notification = Notification.objects.create(
            sender=request.user,
            receiver=guest,
            type='RESERVATION_APPROVAL',
            message=f'{request.user.username} has approved your reservation request '
        )
        notification.save()

        return Response(serializer.data)


class DenyReservation(ChangeState):
    def update(self, request, *args, **kwargs):
        reservation = self.get_object()
        if self.request.user != reservation.host:
            return Response({'error': 'bad request'},
                            status=status.HTTP_400_BAD_REQUEST)
        reservation.deny()
        serializer = self.get_serializer(reservation)

        # send notification to guest
        guest = CustomUser.objects.get(username=serializer.data['tenant_name'])
        notification = Notification.objects.create(
            sender=request.user,
            receiver=guest,
            type='RESERVATION_DENIAL',
            message=f'{request.user.username} has denied your reservation request '
        )
        notification.save()

        return Response(serializer.data)


class ApproveCanceling(ChangeState):
    def update(self, request, *args, **kwargs):
        reservation = self.get_object()
        if self.request.user != reservation.host:
            return Response({'error': 'bad request'},
                            status=status.HTTP_400_BAD_REQUEST)
        reservation.approve_canceling()
        serializer = self.get_serializer(reservation)

        # send notification to guest
        guest = CustomUser.objects.get(username=serializer.data['tenant_name'])
        notification = Notification.objects.create(
            sender=request.user,
            receiver=guest,
            type='CANCELING_APPROVAL',
            message=f'{request.user.username} has approved your canceling request '
        )
        notification.save()

        return Response(serializer.data)


class DenyCanceling(ChangeState):
    def update(self, request, *args, **kwargs):
        reservation = self.get_object()
        if self.request.user != reservation.host:
            return Response({'error': 'bad request'},
                            status=status.HTTP_400_BAD_REQUEST)
        reservation.deny_canceling()
        serializer = self.get_serializer(reservation)

        # send notification to guest
        guest = CustomUser.objects.get(username=serializer.data['tenant_name'])
        notification = Notification.objects.create(
            sender=request.user,
            receiver=guest,
            type='CANCELING_DENIAL',
            message=f'{request.user.username} has denied your canceling request '
        )
        notification.save()

        return Response(serializer.data)


class TerminateReservation(ChangeState):
    def update(self, request, *args, **kwargs):
        reservation = self.get_object()
        if self.request.user != reservation.host:
            return Response({'error': 'bad request'},
                            status=status.HTTP_400_BAD_REQUEST)
        reservation.terminate()
        serializer = self.get_serializer(reservation)

        # send notification to guest
        guest = CustomUser.objects.get(username=serializer.data['tenant_name'])
        notification = Notification.objects.create(
            sender=request.user,
            receiver=guest,
            type='RESERVATION_TERMINATION',
            message=f'{request.user.username} has terminated your reservation '
        )
        notification.save()

        return Response(serializer.data)
