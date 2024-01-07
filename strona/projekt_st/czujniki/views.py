from django.shortcuts import render
from .models import Data,Motion

def data(request):
    data_entries = Data.objects.all()
    motion = Motion.objects.all()
    return render(request, 'data.html', {'data_entries': data_entries, 'motion': motion})
