from .models import Data, Motion
from rest_framework import serializers

class DataSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Data
        fields = '__all__'

class MotionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Motion
        fields ='__all__'