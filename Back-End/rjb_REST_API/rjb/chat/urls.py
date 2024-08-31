from django.urls import path
from . import views

urlpatterns = [
    path('getchats/<int:user_id>/', views.get_chats, name='get_chats'),
    path('getmessages/<int:chat_id>/<int:user_id>/', views.get_messages, name='get_messages'),
    path('get_user_id/<str:email>/', views.get_user_id, name='get_user_id'),
    path('get_or_create_chat/<int:user_id_1>/<int:user_id_2>/', views.get_or_create_chat, name='get_or_create_chat'),
    path('get_user_id_via_company_name/<str:company_name>/', views.get_user_id_via_company_name, name='get_user_id_via_company_name'),
]