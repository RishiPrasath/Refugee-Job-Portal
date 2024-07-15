from django.urls import path
from rjb import views
from django.urls import path, include

urlpatterns = [
    path('api/test/', views.test_json, name='test_json'),  # Add this line
    path('candidates/', include('rjb.candidates.urls')),
    path('advisors/', include('rjb.advisors.urls')),
    path('coordinators/', include('rjb.coordinators.urls')),
    path('employers/', include('rjb.employers.urls')),
    path('auth/', include('rjb.auth.urls')),  # Add this line
]