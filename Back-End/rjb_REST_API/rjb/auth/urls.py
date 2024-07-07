from django.urls import path
from .views import login, register, register_candidate, register_employer, register_hiring_coordinator, register_case_worker

urlpatterns = [
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('register/candidate/', register_candidate, name='register_candidate'),
    path('register/employer/', register_employer, name='register_employer'),
    path('register/hiring-coordinator/', register_hiring_coordinator, name='register_hiring_coordinator'),
    path('register/case-worker/', register_case_worker, name='register_case_worker'),
]