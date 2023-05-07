from django.urls import path
from .views import *

app_name = "reservations"

urlpatterns = [
    path('<str:p_id>/', ReservationList.as_view(), name='p_list'),
    path('list/<str:state>/<str:person>/', ReservationStateListView.as_view(), name='list'),
    path('list/type/<str:type>/', ReservationUserListView.as_view(), name='u_list'),
    path('<str:p_id>/reserve/', CreateReservation.as_view(), name='create'),
    path('<int:pk>/cancel/', CancelReservation.as_view(), name='cancel'),
    path('<int:pk>/approve/', ApproveReservation.as_view(), name='approve'),
    path('<int:pk>/deny/', DenyReservation.as_view(), name='deny'),
    path('<int:pk>/approve_canceling/', ApproveCanceling.as_view(),
         name='approve_canceling'),
    path('<int:pk>/deny_canceling/', DenyCanceling.as_view(),
         name='deny_canceling'),
    path('<int:pk>/terminate/', TerminateReservation.as_view(),
         name='terminate'),
]
