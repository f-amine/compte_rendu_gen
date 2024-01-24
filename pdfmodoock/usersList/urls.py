from django.contrib import admin
from django.urls import path, include
from . import views
from .views import *

urlpatterns = [
    path('generate_pdf/', views.generate_pdf, name='generate_pdf'),
    path('get_template/', views.get_template_data, name='get_template'),
    path('create_template/', views.create_template_data, name='create_template'),
    path('delete_template/<int:pk>/', views.delete_template, name='delete_template'),
]