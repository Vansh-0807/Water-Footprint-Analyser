from rest_framework import serializers
from .models import Crop, SoilType, WaterCalculation

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__' #this tells the Django to convert every column in the crop table into JSON

class SoilTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilType
        fields = '__all__'

class WaterCalculationSerializer(serializers.ModelSerializer):
    #this automatically includes crop name and soil name in JSON
    #Instead of just sending their ID numbers to frontend
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    soil_name = serializers.CharField(source='soil_type.name', read_only=True)

    class Meta:
        model = WaterCalculation
        fields = [
            'id', 'user', 'crop', 'crop_name', 'soil_type', 'land_area',
            'total_water_liters', 'created_at'
        ]

        # we will tell django not to force the user to provide total_water_liters
        # because django will calculate them 
        read_only_fields = ['total_water_liters', 'created_at'] 