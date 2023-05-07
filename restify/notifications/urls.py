from django.urls import path

from .views import NotificationView, NotificationCreateView, NotificationListView, NotificationDeleteView, \
    NotificationDeleteAllView

app_name = "notifications"

urlpatterns = [
    path('create/', NotificationCreateView.as_view(), name='create'),
    path('list/', NotificationListView.as_view(), name='list'),
    path('view/<int:pk>/', NotificationView.as_view(), name='view'),
    path('delete/<int:pk>/', NotificationDeleteView.as_view(), name='delete'),
    path('deleteAll/', NotificationDeleteAllView.as_view(), name='deleteAll'),
]
