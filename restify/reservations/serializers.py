import datetime

from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer, CharField
from .models import Reservation
from property.models import Property


class ReservationListSerializer(ModelSerializer):
    tenant_name = CharField(source='tenant.username', read_only=True)
    tenant_id = CharField(source='tenant.id', read_only=True)
    host_name = CharField(source='host.username', read_only=True)
    property_address = CharField(source='property.address', read_only=True)
    property_name = CharField(source='property.name', read_only=True)
    property_id = CharField(source='property.id', read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'start', 'end', 'state', 'tenant_name', 'tenant_id',
                  'host_name', 'property_name', 'property_id',
                  'property_address', 'creation_time']


class ReservationCreateSerializer(ModelSerializer):
    tenant_name = CharField(source='tenant.username', read_only=True)
    host_name = CharField(source='host.username', read_only=True)
    property_id = CharField(source='property.id', read_only=True)

    class Meta:
        model = Reservation
        read_only_fields = ['id', 'state', 'changed_states']
        fields = ['id', 'start', 'end', 'state', 'tenant_name', 'host_name', 'property_id', 'creation_time', 'changed_states']

    def validate(self, data):
        property_id = self.context['view'].kwargs.get('p_id')
        start = data['start'].isoformat()
        end = data['end'].isoformat()
        reservations = Reservation.objects.filter(
            Q(state='Pending') | Q(state='Approved') | Q(state='Canceling'),
            property_id=property_id,
            end__gte=start,
            start__lte=end,
        )
        if reservations.exists():
            print(reservations)
            raise ValidationError('There is already a reservation on that '
                                  'date.')
        if start > end:
            raise ValidationError('End date must be greater than start date.')
        return data

    def create(self, validated_data):
        property_id = self.context['view'].kwargs.get('p_id')
        p = get_object_or_404(Property, id=property_id)
        reservation = Reservation(
            start=validated_data['start'],
            end=validated_data['end'],
            property=p,
            host=p.owner,
            tenant=self.context['request'].user,
            state='Pending',
        )
        reservation.save()
        return reservation


class ReservationCancelSerializer(ModelSerializer):
    tenant_name = CharField(source='tenant.username', read_only=True)
    host_name = CharField(source='host.username', read_only=True)

    class Meta:
        model = Reservation
        read_only_fields = ['id', 'start', 'end', 'state', 'tenant_name',
                            'host_name', 'property_id', 'creation_time',
                            'changed_states']
        fields = ['id', 'start', 'end', 'state', 'tenant_name', 'host_name',
                  'property_id', 'creation_time', 'changed_states']

    def update(self, instance, validated_data):
        if self.is_valid():
            instance.cancel_reservation()
            return instance
