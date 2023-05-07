from django.urls import path
from .views import SignUpView, LogoutView, MyTokenObtainPairView, ProfileView, PasswordChangeView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserProfileByUsernameView

app_name = "accounts"

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('password/', PasswordChangeView.as_view(), name='password'),
    path('profile/<str:username>/', UserProfileByUsernameView.as_view(), name='profile_by_username'),
]