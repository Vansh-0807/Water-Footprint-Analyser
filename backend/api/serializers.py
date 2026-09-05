from rest_framework import serializers
from .models import Crop, SoilType, WaterCalculation
from django.contrib.auth.models import User

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
            'id', 'user', 'crop', 'crop_name', 'soil_type', 'soil_name', 'land_area',
            'total_water_liters', 'created_at'
        ]

        # we will tell django not to force the user to provide total_water_liters
        # because django will calculate them 
        read_only_fields = ['user', 'total_water_liters', 'created_at'] 

class UserSerializer(serializers.ModelSerializer):
    # This line was missing! We MUST define the custom field here so Django knows it's allowed
    full_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        # Changed 'fullname' to 'full_name' to match our variable
        fields = ['username', 'full_name', 'password']
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        
        # 1 grab the full name from react (if it exists)
        full_name = validated_data.pop('full_name', '')

        # 2 split it by the space into a list
        name_parts = full_name.split(' ')
        first_name = name_parts[0] if len(name_parts) > 1 else ''
        last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ''

        # 3 create the user with the properly split names
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password'],
            first_name = first_name,
            last_name = last_name
        )
        return user
    