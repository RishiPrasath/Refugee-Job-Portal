from django.urls import path
from .views import get_notifications

urlpatterns = [
    path('getnotifications/', get_notifications, name='get_notifications'),
]