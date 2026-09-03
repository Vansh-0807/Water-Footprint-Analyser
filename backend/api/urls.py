from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropViewSet, SoilTypeViewSet, WaterCalculationViewSet, UserCreateView

# creating a router and register our viewsets with it
router = DefaultRouter()
router.register(r'crops', CropViewSet, basename='crop')
router.register(r'soils', SoilTypeViewSet, basename='soil')
router.register(r'calculations', WaterCalculationViewSet, basename='calculation')

# the API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserCreateView.as_view(), name='register'),
]