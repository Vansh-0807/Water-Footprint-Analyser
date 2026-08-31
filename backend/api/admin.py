from django.contrib import admin
from .models import Crop, SoilType, WaterCalculation

admin.site.register(Crop)
admin.site.register(SoilType)
admin.site.register(WaterCalculation)

