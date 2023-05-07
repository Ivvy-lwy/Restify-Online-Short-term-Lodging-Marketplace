from datetime import datetime

from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, ListAPIView, DestroyAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.db.models import Q
from .serializers import PropertyViewSerializer, PropertyCreateSerializer, PropertyImageSerializer
from django.shortcuts import get_object_or_404
from .models import Property, PropertyImage
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from accounts.models import CustomUser

from rest_framework import generics
from .models import Price
from .serializers import PriceSerializer, PriceDateSerializer
from django.http import JsonResponse
from .models import PropertyImage
from rest_framework.parsers import MultiPartParser

from django.http import JsonResponse
from rest_framework.views import APIView
from .models import PropertyImage


# Create your views here.

class PropertyCreateView(CreateAPIView):
    serializer_class = PropertyCreateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        images_data = request.FILES.getlist('images')
        serializer = PropertyCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        property_instance = serializer.save(owner=request.user)

        for img in images_data:
            PropertyImage.objects.create(property=property_instance, image=img)

        return Response(PropertyViewSerializer(property_instance).data, status=status.HTTP_201_CREATED)



# class PropertyView(RetrieveAPIView, UpdateAPIView):
#     serializer_class = PropertyViewSerializer
#     permission_classes = [IsAuthenticated]
#     #permission_classes = [AllowAny]

#     def get_object(self):
#         property = get_object_or_404(Property, id=self.kwargs['pk'])
#         return property


class PropertyView(RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    serializer_class = PropertyViewSerializer
    permission_classes = [IsAuthenticated]
    # parser_classes = [MultiPartParser]

    def get_object(self):
        property = get_object_or_404(Property, id=self.kwargs['pk'])
        return property

    def get(self, request, *args, **kwargs):
        property_instance = self.get_object()
        property_serializer = PropertyViewSerializer(property_instance)
        images_serializer = PropertyImageSerializer(property_instance.property_images.all(), many=True)
        response_data = property_serializer.data
        response_data['images'] = images_serializer.data
        return Response(response_data)

    def put(self, request, *args, **kwargs):
        property_instance = self.get_object()
        image = request.FILES.get('image')

        # Update property fields if data is present
        if not image:
            serializer = PropertyViewSerializer(property_instance, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            return JsonResponse(serializer.errors, status=400)

        # Handle image upload
        property_image = PropertyImage.objects.create(property=property_instance, image=image)
        property_image_serializer = PropertyImageSerializer(property_image)

        return JsonResponse(property_image_serializer.data, status=201)


    def delete(self, request, *args, **kwargs):
        property_instance = self.get_object()
        image_id = request.data.get('image_id')

        if not image_id:
            return JsonResponse({"error": "Image ID is required"}, status=400)

        try:
            image = PropertyImage.objects.get(id=image_id, property=property_instance)
            image.delete()
            return JsonResponse({"success": True}, status=200)
        except PropertyImage.DoesNotExist:
            return JsonResponse({"error": "Image not found"}, status=404)

class PropertyListView(ListAPIView):
    serializer_class = PropertyViewSerializer
    permission_classes = [IsAuthenticated]
    #permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Property.objects.filter(owner=self.request.user)
        return queryset


# https://learnbatta.com/blog/class-based-views-in-django-rest-framework-79/
class PropertyDeleteView(DestroyAPIView):
    serializer_class = PropertyViewSerializer
    permission_classes = [IsAuthenticated]
    #permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Property.objects.filter(id=self.kwargs['pk'])
        return queryset

    def delete(self, request, *args, **kwargs):
        self.destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PropertySearchView(ListAPIView):
    serializer_class = PropertyViewSerializer
    permission_classes = [AllowAny]
    filter_backends = (DjangoFilterBackend, OrderingFilter,)

    filterset_fields = ['city', 'guest', 'bedroom', 'bed', 'bathroom']
    ordering_fields = ['price', 'rating']

    def get_queryset(self):
        queryset = Property.objects.all()
        return queryset

# https://www.django-rest-framework.org/api-guide/generic-views/
class PriceCreateView(CreateAPIView):
    serializer_class = PriceSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        property = get_object_or_404(Property, id=pk)

        if property.owner != request.user:
            return Response({"Error": "You do not have permission to change this property's prices."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = PriceSerializer(data=request.data, context={'property': property})
        serializer.is_valid(raise_exception=True)
        serializer.save(property=property)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PriceUpdateView(RetrieveUpdateDestroyAPIView):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'price_pk'

    def get_object(self):
        property = get_object_or_404(Property, id=self.kwargs['property_pk'])
        price_period = get_object_or_404(Price, id=self.kwargs['price_pk'])

        if property.owner != self.request.user:
            raise Response({"Error": "You do not have permission to change this property's prices."},
                            status=status.HTTP_403_FORBIDDEN)

        return price_period


class PropertyPricePeriodsView(ListAPIView):
    pagination_class = None
    serializer_class = PriceDateSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        date = self.kwargs['date']
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
        p_id = self.kwargs['p_id']
        property_instance = get_object_or_404(Property, id=p_id)
        queryset = Price.objects.filter(
            Q(start_date__lte=date_obj) & Q(end_date__gte=date_obj),
            property_id=p_id)

        if not queryset.exists():
            return [{
                'start_date': None,
                'end_date': None,
                'price': property_instance.price

            }]

        return queryset
