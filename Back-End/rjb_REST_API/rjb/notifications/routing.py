from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from rjb.notifications.consumers import NotificationConsumer, EventConsumer

websocket_urlpatterns = [
    re_path(r"ws/notifications/(?P<user_id>\d+)/$", NotificationConsumer.as_asgi()),
    re_path(r"ws/events/$", EventConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})