from django.shortcuts import render
from .models import Data ,Motion
from .serializer import DataSerializer, MotionSerializer
from rest_framework import viewsets


def index(request):
    return render(request, 'index.html')

def temperature(request):
    data = Data.objects.all()
    return render(request, 'temperature.html', {'data': data})

def humidity(request):
    data = Data.objects.all()
    return render(request, 'humidity.html', {'data': data})

def motion(request):
    data = Motion.objects.all()
    return render(request, 'motion.html', {'data': data})


class DataViewSet(viewsets.ModelViewSet):
    queryset = Data.objects.all()
    serializer_class = DataSerializer

class MotionViewSet(viewsets.ModelViewSet):
    queryset = Motion.objects.all()
    serializer_class = MotionSerializer