from django.urls import path
from .views import *

app_name = "comments"

urlpatterns = [
    path('<str:r_id>/exists/', CommentExists.as_view(),
         name='comment_exists'),
    path('property/<int:p_id>/exists/', PropertyCommentExists.as_view(),
         name='property_comment_exists'),
    path('<str:r_id>/user/', CreateComment.as_view(),
         name='comment'),
    path('<str:r_id>/', CreatePropertyComment.as_view(),
         name='property_comment'),
    path('c_user/<str:u_id>/', CommentUserListView.as_view(),
         name='comments_user'),
    path('property/<int:p_id>/', PropertyCommentListView.as_view(),
         name='comments_property'),
    path('property/<int:p_id>/<int:r_id>/', PropertyCommentReplyView.as_view(),
            name='comments_property_reply'),
    path('reservation/<str:r_id>/exists/', ReservationCommentExists.as_view(),
            name='reservation_comment_exists'),
]
