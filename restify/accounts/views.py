from django.shortcuts import render
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView
from .serializers import SignUpSerializer, MyTokenObtainPairSerializer, ProfileSerializer,  PasswordChangeSerilizer
# Create your views here.
#, MyTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout
from django.urls import reverse_lazy
from .models import CustomUser
from django.shortcuts import get_object_or_404
# redirect
from django.shortcuts import redirect
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import MyTokenObtainPairSerializer, SignUpSerializer



class SignUpView(CreateAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class LogoutView(APIView):
    # If the user is unauthenticated, simply ignore the request. In either case, return a redirect to /accounts/login
    def get(self, request):
        if request.user.is_authenticated or request.user.username != '':
            logout(request)
        return redirect('accounts:login')
    

class ProfileView(RetrieveAPIView, UpdateAPIView):
    serializer_class = ProfileSerializer
    parser_classes = (MultiPartParser, FormParser)
    

    def get_object(self):
        user = get_object_or_404(CustomUser, id = self.request.user.id)
        return user


# https://studygyaan.com/django/django-rest-framework-tutorial-change-password-and-reset-password
class PasswordChangeView(UpdateAPIView):
    serializer_class = PasswordChangeSerilizer
    # permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        user = get_object_or_404(CustomUser, id = self.request.user.id)
        return user
    
    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.object.set_password(serializer.data.get("password1"))
            self.object.save()

            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully'
            }

            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileByUsernameView(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]
    lookup_field = 'username'