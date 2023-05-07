from django.urls import path
from .views import PropertyCreateView, PropertyView, PropertyListView, PropertyDeleteView, PropertySearchView, PriceCreateView, PriceUpdateView
from .views import PropertyPricePeriodsView

app_name = "property"

urlpatterns = [
    path('create/', PropertyCreateView.as_view(), name='create'),
    path('<int:pk>/details/', PropertyView.as_view(), name='details'),
    path('list/', PropertyListView.as_view(), name='list'),
    path('<int:pk>/delete/', PropertyDeleteView.as_view(), name='delete'),
    path('result/', PropertySearchView.as_view(), name='search'),
    path('<int:pk>/price/', PriceCreateView.as_view(), name='price_create'),
    path('<int:property_pk>/price/<int:price_pk>/', PriceUpdateView.as_view(), name='price_update'),
    path('<int:p_id>/<str:date>/price_periods/', PropertyPricePeriodsView.as_view(), name='price_periods'),
]
