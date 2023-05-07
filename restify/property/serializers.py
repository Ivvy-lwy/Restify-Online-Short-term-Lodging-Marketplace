from rest_framework.serializers import ModelSerializer, CharField, ValidationError, IntegerField
from django.shortcuts import get_object_or_404
from .models import Property, Price, PropertyImage
from accounts.models import CustomUser
from rest_framework import status
from rest_framework.response import Response


class PriceDateSerializer(ModelSerializer):
    property_id = CharField(source='property.id', read_only=True)

    class Meta:
        model = Price
        fields = ['id', 'start_date', 'end_date', 'price', 'property_id']


class PriceSerializer(ModelSerializer):
    class Meta:
        model = Price
        fields = ['id', 'start_date', 'end_date', 'price']

    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date >= end_date:
            raise ValidationError("Please enter a valid date range.")

        overlapping_prices = Price.objects.filter(
            property=self.context['property'],
            start_date__lte=end_date,
            end_date__gte=start_date,
        )

        if overlapping_prices.exists():
            raise ValidationError("There is already a price period for this date range.")

        return data


class PropertyImageSerializer(ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']


class PropertyCreateSerializer(ModelSerializer):
    images = PropertyImageSerializer(many=True, required=False)

    class Meta:
        model = Property
        fields = ['id', 'name', 'address', 'city', 'description', 'guest', 'bedroom', 'bed', 'bathroom', 'price', 'images']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        property_instance = Property.objects.create(**validated_data)

        for image_data in images_data:
            PropertyImage.objects.create(property=property_instance, **image_data)

        return property_instance

class PropertyViewSerializer(ModelSerializer):
    price_periods = PriceSerializer(many=True, read_only=True)
    owner_username = CharField(source='owner.username', read_only=True)
    owner_id = IntegerField(source='owner.id', read_only=True)
    rating = CharField(read_only=True)
    rating_num = CharField(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = ['id', 'owner_username', 'owner_id', 'price_periods', 'name', 'address', 'city', 'description', 'guest', 'bedroom', 'bed', 'bathroom', 'price', 'images', 'rating', 'rating_num', 'images']

    # def validate(self, attrs):
    #     # compare start_date and end_date
    #     if not attrs['start_date']:
    #         attrs['start_date'] = None
    #     if not attrs['end_date']:
    #         attrs['end_date'] = None

    #     if attrs['start_date'] and attrs['end_date']:
    #         if attrs['start_date'] > attrs['end_date']:
    #             raise ValidationError('Start date must be before end date.')
    #     return attrs

