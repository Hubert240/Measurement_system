from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'data', views.DataViewSet)
router.register(r'motion', views.MotionViewSet)

urlpatterns = [
    path('temperature/', views.temperature, name='temperature'),
    path('motion/', views.motion, name='motion'),
    path('humidity/', views.humidity, name='humidity'),
    path('', views.index, name='index'),
    path('api/', include(router.urls)),
]
