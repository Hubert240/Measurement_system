from django.shortcuts import render
from .models import Data, Motion
from .serializer import DataSerializer, MotionSerializer
from rest_framework import viewsets
from django.http import JsonResponse
from datetime import datetime


def index(request):
    return render(request, 'index.html')

def temperature(request):
    data = Data.objects.all().order_by('-date')
    count_items = Data.objects.all().order_by('-date').count()

    chart_data = []
    chart_data2 = []
    zeros = []
    x=1
    last_temperatures = Data.objects.order_by('date')[count_items-10:]
    for i in last_temperatures:
        chart_data.append(i.temperature)
        chart_data2.append(i.humidity)
        zeros.append(x)
        x+=1


    return render(request, 'temperature.html', {'data': data, 'last': chart_data, 'hum':chart_data2, 'zeros': zeros})

def humidity(request):
    data = Data.objects.all().order_by('-date')
    chart_data = []
    chart_data2 = []
    zeros = []
    x = 1
    last_temperatures = Data.objects.order_by('-date')[:10]
    for i in last_temperatures:
        chart_data.append(i.temperature)
        chart_data2.append(i.humidity)
        zeros.append(x)
        x += 1
    return render(request, 'humidity.html', {'data': data, 'last': chart_data, 'hum':chart_data2, 'zeros': zeros})

def motion(request):
    data = Motion.objects.all()
    return render(request, 'motion.html', {'data': data})


class DataViewSet(viewsets.ModelViewSet):
    queryset = Data.objects.all()
    serializer_class = DataSerializer

class MotionViewSet(viewsets.ModelViewSet):
    queryset = Motion.objects.all()
    serializer_class = MotionSerializer

def current_date(request):
    today_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return JsonResponse({'current_date': today_date})


def data_from_specific_day(request, dzien):
    try:
        requested_date = datetime.strptime(dzien, '%Y-%m-%d')

        queryset = Motion.objects.filter(date__date=requested_date)

        result_data = list(queryset.values('motion', 'date'))

        return JsonResponse({'data_from_requested_day': result_data})
    except ValueError:
        return JsonResponse({'error': 'Nieprawidłowy format daty'}, status=400)



