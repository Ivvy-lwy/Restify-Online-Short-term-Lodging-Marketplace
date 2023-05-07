from django.shortcuts import get_list_or_404, render
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated

from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination

# Create your views here.
from property.models import Property

from accounts.models import CustomUser
from notifications.models import Notification


class CommentExists(ListAPIView):
    serializer_class = CommentExistsSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Comment.objects.filter(reservation=self.kwargs['r_id'])
        return queryset


class PropertyCommentExists(ListAPIView):
    serializer_class = PropertyCommentSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = CommentForProperty.objects.filter(property=self.kwargs['p_id'])
        return queryset

class ReservationCommentExists(ListAPIView):
    serializer_class = PropertyCommentSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = CommentForProperty.objects.filter(reservation=self.kwargs['r_id'])
        return queryset


class CommentUserListView(ListAPIView):
    serializer_class = CommentUserSerializer
    pagination_class = None

    # filter by state
    def get_queryset(self):
        u = get_object_or_404(CustomUser, id=self.kwargs['u_id'])
        queryset = Comment.objects.filter(tenant=u)
        return queryset


class PropertyCommentReplyView(ListAPIView):
    serializer_class = PropertyCommentSerializer
    pagination_class = None

    # filter by state
    def get_queryset(self):
        p = self.kwargs['p_id']
        pr = get_object_or_404(Property, id=p)
        queryset = CommentForProperty.objects.filter(property=pr, comment_num=2, reservation=self.kwargs['r_id'])
        return queryset


class PropertyCommentListView(ListAPIView):
    serializer_class = PropertyCommentSerializer
    pagination_class = PageNumberPagination

    # filter by state
    def get_queryset(self):
        p = self.kwargs['p_id']
        pr = get_object_or_404(Property, id=p)
        queryset = CommentForProperty.objects.filter(property=pr, comment_num=1)
        # queryset = get_list_or_404(queryset)
        return queryset

    # def get(self, request, p_id):
    #     s = self.get_queryset()
    #     if s == {}:
    #         return Response("No comment.")
    #     p = self.kwargs['p_id']
    #     pr = get_object_or_404(Property, id=p)
    #
    #     d = {}
    #     for c in s:
    #         r = c.reservation
    #         d[r.id] = {}
    #         lst = CommentForProperty.objects.filter(
    #             property=pr, reservation=r).order_by('-comment_num')
    #         for i in lst:
    #             if i.comment_num % 2 == 0:
    #                 d[r.id][i.comment_num] = ["host: " + str(i.host.username),
    #                                           "text: " + str(i.text)]
    #             if i.comment_num % 2 == 1:
    #                 d[r.id][i.comment_num] = ["guest: " + str(i.host.username),
    #                                           "text: " + str(i.text)]
    #     if d == {}:
    #         d = "No comment."
    #
    #     page = self.paginate_queryset(list(d.values()))
    #     if page is not None:
    #         d = self.get_paginated_response(page).data
    #
    #     return Response(d)


class CreateComment(CreateAPIView):
    serializer_class = CommentCreateSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreatePropertyComment(CreateComment):
    serializer_class = PropertyCommentCreateSerializer

    def post(self, request, *args, **kwargs):
        print("CreatePropertyComment post method called")
        print("1property comment1")
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print("property comment")
            serializer.save()
            print(serializer.data)
            property_id = serializer.data['property']
            p = Property.objects.get(id=property_id)
            print(serializer.data['host_name'])

            # send notification to host
            print("send notification to host")
            print(serializer.data)
            host = CustomUser.objects.get(username=serializer.data['host_name'])
            tenant = CustomUser.objects.get(username=serializer.data['tenant_name'])

            if request.user == host:
                notification = Notification.objects.create(
                    sender=request.user,
                    receiver=tenant,
                    type='COMMENT',
                    message=f'You have received a reply from {host}.'
                )
            else:
                notification = Notification.objects.create(
                    sender=request.user,
                    receiver=host,
                    type='COMMENT',
                    message=f'{request.user.username} has commented on your property {p.name}!'
                )
            notification.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PropertyCommentSerializer

    def get(self, request, c_id):
        c = get_object_or_404(CommentForProperty, id=c_id)
        s = PropertyCommentSerializer(c)
        return Response(s.data)
