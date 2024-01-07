from django.urls import path
from . import views

urlpatterns = [
    path('temperature/', views.temperature, name='temperature'),
    path('motion/', views.motion, name='motion'),
    path('humidity/', views.humidity, name='humidity'),
    path('', views.index, name='index'),
]
