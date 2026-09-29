import pandas as pd
from django.contrib import admin
from .models import CropDataset, Crop, SoilType, WaterCalculation
from .rag_engine import process_dataset

@admin.register(CropDataset)
class CropDatasetAdmin(admin.ModelAdmin):
    list_display = ('name', 'uploaded_at', 'is_processed')

    def save_model(self, request, obj, form, change):
        # 1. Save the uploaded CSV file to the hard drive
        super().save_model(request, obj, form, change)

        # 2. Automatically extract data for the react dropdowns
        if not obj.is_processed:
            try:
                # read the csv file you just uploaded
                df = pd.read_csv(obj.file.path)

                cols = {str(col).strip().upper(): col for col in df.columns}

                # extract crops (Matches 'Crop', 'Crop Type' or 'label')
                crop_col = cols.get('CROP') or cols.get('CROP TYPE') or cols.get('LABEL')
                if crop_col:
                    for c in df[crop_col].dropna().unique():
                        Crop.objects.get_or_create(name=str(c).strip().title())

                #extract soil (matches 'soil', 'soil type' or 'soil_type')
                soil_col = cols.get('SOIL') or cols.get('SOIL TYPE') or cols.get('SOIL_TYPE')
                if soil_col:
                    for s in df[soil_col].dropna().unique():
                        SoilType.objects.get_or_create(name=str(s).strip().title()) 

                # 3. finally send the csv file to the rag to train the AI
                success, msg = process_dataset(obj.file.path)
                if success:
                    obj.is_processed = True
                    obj.save()
            except Exception as e:
                print("Error extracting CSV for dropdowns:", e)

admin.site.register(Crop)
admin.site.register(SoilType)
admin.site.register(WaterCalculation)

