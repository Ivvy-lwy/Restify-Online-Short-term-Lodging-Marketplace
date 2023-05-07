from rest_framework.serializers import ModelSerializer, CharField, ValidationError
from django.contrib.auth import authenticate
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.shortcuts import get_object_or_404

# https://medium.com/django-rest/django-rest-framework-login-and-register-user-fd91cf6029d5
class SignUpSerializer(ModelSerializer):
    password = CharField(style={'input_type': 'password'}, write_only=True, required=True)
    password2 = CharField(style={'input_type': 'password'}, write_only=True, required=True, label='Confirm password')

    class Meta:
        model = CustomUser
        read_only_fields = ['id']
        fields = ('id', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    

# https://stackoverflow.com/questions/72156983/authentication-with-three-fields-in-django-rest-framework-simple-jwt
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['id'] = self.user.id
        data['username'] = self.user.username
        return data
    

class ProfileSerializer(ModelSerializer):
    user_name = CharField(source='username', read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'user_name', 'first_name', 'last_name', 'email', 'phone_number', 'avatar']


class PasswordChangeSerilizer(ModelSerializer):
    password1 = CharField(style={'input_type': 'password'}, label='New password')
    password2 = CharField(style={'input_type': 'password'}, label='Confirm password')

    class Meta:
        model = CustomUser
        fields = ['password1', 'password2']

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise ValidationError({"password1": "Password fields didn't match."})
        return attrs
    