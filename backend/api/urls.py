from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropViewSet, SoilTypeViewSet, WaterCalculationViewSet, UserCreateView, SoilTypeViewSet, ChatbotView

# creating a router and register our viewsets with it
router = DefaultRouter()
router.register(r'crops', CropViewSet, basename='crop')
router.register(r'soils', SoilTypeViewSet, basename='soil')
router.register(r'calculations', WaterCalculationViewSet, basename='calculation')

from django.http import JsonResponse

# the API URLs are now determined automatically by the router
urlpatterns = [
    path('health/', lambda req: JsonResponse({"status": "ok"}), name='api-health'),
    path('', include(router.urls)),
    path('register/', UserCreateView.as_view(), name='register'),
    path('chat/', ChatbotView.as_view(), name='chatbot-query')
]