from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer, CharField
from .models import *


class CommentUserSerializer(ModelSerializer):
    tenant_name = CharField(source='tenant.username', read_only=True)
    host_name = CharField(source='host.username', read_only=True)

    def validate(self, data):
        u_id = self.context['view'].kwargs.get('u_id')
        u = get_object_or_404(CustomUser, id=u_id)
        reservation = Reservation.objects.filter(
            host=self.context['request'].user,
            tenant=u
        )
        get_list_or_404(reservation)
        return data

    class Meta:
        model = Comment
        read_only_fields = ['id', 'created_at', 'new_comment']
        fields = ['id', 'tenant_name', 'host_name', 'text', 'created_at',
                  'new_comment', 'rating']


class CommentExistsSerializer(ModelSerializer):
    tenant_name = CharField(source='tenant.username', read_only=True)
    host_name = CharField(source='host.username', read_only=True)
    class Meta:
        model = Comment
        read_only_fields = ['id', 'created_at', 'new_comment']
        fields = ['id', 'tenant_name', 'host_name', 'text', 'created_at',
                  'new_comment', 'rating']



class PropertyCommentSerializer(ModelSerializer):
    tenant_name = CharField(source='tenant.username', read_only=True)
    host_name = CharField(source='host.username', read_only=True)
    class Meta:
        model = CommentForProperty
        read_only_fields = ['id', 'created_at', 'new_comment', 'is_reply',
                            'comment_num']
        fields = ['id', 'tenant_name', 'host_name', 'text', 'created_at',
                  'new_comment', 'rating', 'is_reply', 'comment_num', 'reservation']


class CommentCreateSerializer(ModelSerializer):
    tenant_name = CharField(source='tenant.username', read_only=True)
    host_name = CharField(source='host.username', read_only=True)

    class Meta:
        model = Comment
        read_only_fields = ['id', 'created_at', 'new_comment']
        fields = ['id', 'tenant_name', 'host_name', 'text', 'created_at',
                  'new_comment', 'rating']

    def validate(self, data):
        reservation_id = self.context['view'].kwargs.get('r_id')
        r = get_object_or_404(Reservation, id=reservation_id)
        t = r.tenant
        comment = Comment.objects.filter(
            reservation=r
        )

        if r.host != self.context['request'].user:
            raise ValidationError('You have no access.')
        elif comment.exists():
            raise ValidationError('You already left a comment.')
        elif r.state != 'Completed':
            raise ValidationError('The reservation is ongoing.')
        elif r.tenant != t:
            raise ValidationError('Wrong tenant')
        return data

    def create(self, validated_data):
        reservation_id = self.context['view'].kwargs.get('r_id')
        r = get_object_or_404(Reservation, id=reservation_id)
        t = r.tenant
        comment = Comment(
            host=self.context['request'].user,
            tenant=t,
            text=validated_data['text'],
            new_comment=True,
            rating=validated_data['rating'],
            reservation=r,
        )
        comment.save()
        return comment


class PropertyCommentCreateSerializer(CommentCreateSerializer):
    class Meta:
        model = CommentForProperty

        read_only_fields = ['id', 'created_at', 'new_comment', 'is_reply',
                            'comment_num', 'property']
        fields = ['id', 'tenant_name', 'host_name', 'text', 'created_at',
                  'new_comment', 'rating', 'is_reply', 'comment_num',
                  'property']

    def validate(self, data):
        reservation_id = self.context['view'].kwargs.get('r_id')
        r = get_object_or_404(Reservation, id=reservation_id)
        comment = Comment.objects.filter(
            reservation=r
        )
        print(comment)
        print(len(comment))
        if len(comment) % 2 == 0 and r.tenant != \
                self.context['request'].user:
            raise ValidationError('You can not comment as host.')
        elif len(comment) % 2 == 1 and r.host != \
                self.context['request'].user:
            raise ValidationError('You can not comment as tenant.')
        elif r.state != 'Completed':
            raise ValidationError('The reservation is ongoing.')
        elif len(comment) % 2 == 0 and r.tenant != self.context['request'].user:
            print(r.tenant)
            print(self.context['request'].user)
            raise ValidationError('You have no access')
        elif len(comment) % 2 == 1 and r.host != self.context['request'].user:
            raise ValidationError('You have no access')
        return data

    def create(self, validated_data):
        reservation_id = self.context['view'].kwargs.get('r_id')
        r = get_object_or_404(Reservation, id=reservation_id)
        c = CommentForProperty.objects.filter(reservation=r)
        if len(c) == 0:
            b = False
            rating = validated_data['rating']
        else:
            b = True
            rating = None
            self.fields['rating'].read_only = True
        comment = CommentForProperty(
            host=r.host,
            tenant=r.tenant,
            text=validated_data['text'],
            new_comment=True,
            rating=rating,
            reservation=r,
            is_reply=b,
            comment_num=len(c)+1,
            property=r.property
        )
        comment.save()
        return comment
