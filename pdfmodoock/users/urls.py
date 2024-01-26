from django.contrib import admin
from django.urls import path, include
from .views import RegisterView,LoginView,UserView,LogoutView,TokenValidationView
from . import views
from .views import *
from django.contrib.auth import views as auth_views
urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('user_list/', views.userList, name='user_list'),
    path('check-token-validity/<str:jwt_token>',TokenValidationView.as_view())
    ]