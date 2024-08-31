from django.urls import path
from .views import get_notifications, dismiss_notification

urlpatterns = [
    path('getnotifications/', get_notifications, name='get_notifications'),
    path('dismiss/<int:notification_id>/', dismiss_notification, name='dismiss_notification'),
]