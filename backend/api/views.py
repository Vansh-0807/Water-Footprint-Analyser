from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Crop, SoilType, WaterCalculation
from .serializers import CropSerializer, SoilTypeSerializer, WaterCalculationSerializer, UserSerializer

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# this sends the list of crops to reat
class CropViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer

# this sends the list of soil type to react
class SoilTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SoilType.objects.all()
    serializer_class = SoilTypeSerializer

class WaterCalculationViewSet(viewsets.ModelViewSet):
    serializer_class = WaterCalculationSerializer
    permission_classes = [IsAuthenticated] # FIXED: permission_classes (plural)

    def get_queryset(self):
        return WaterCalculation.objects.filter(user=self.request.user).order_by('-created_at')

    # this function is triggered when React clicks "Calculate"
    def perform_create(self, serializer):
        # 1. get the crop, soil and area the user selected
        crop = serializer.validated_data['crop']
        soil = serializer.validated_data['soil_type'] # FIXED: The database field is 'soil_type', not 'soil'
        area = serializer.validated_data['land_area']

        # 2. base water required per hectare 
        base_water_per_hectare = 1000

        # 3. the maths (base * area * crop factor / soil retention)
        final_water = (base_water_per_hectare * area * crop.water_factor) / soil.retention_factor

        #4. save it to the database with the logged-in user and the final result attached
        serializer.save(
            user = self.request.user,
            total_water_liters = final_water
        )
