from django.db import models
from django.contrib.auth.models import User

# crop table
class Crop(models.Model):
    # this will hold the name of the Indian Crops
    name = models.CharField(max_length = 100, unique = True)
    # a multiplier used in our math later 
    water_factor = models.FloatField(default = 1.0)

    def __str__(self):
        return self.name

# soil table
class SoilType(models.Model):
    # this will hold the soil type name 
    name = models.CharField(max_length=100, unique=True)
    # how well the soil holds water
    retention_factor = models.FloatField(default = 1.0)

    def __str__(self):
        return self.name

#water calculation table
class WaterCalculation(models.Model):
    # foreign key links this to the specific farmer who made it
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # links to the crop and soil they selected from the dropdowns
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    soil_type = models.ForeignKey(SoilType, on_delete=models.CASCADE)

    # the land area they typed into the box
    land_area = models.FloatField()

    # the final calculated results
    total_water_liters = models.FloatField()

    # automatically saves the exact date and time this calculation was made
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.crop.name} calculation"
    