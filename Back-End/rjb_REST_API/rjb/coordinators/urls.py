from django.urls import path
from .views import home, search, candidate_view, employer_view, job_posting_view, job_application_view

urlpatterns = [
    path('', home, name='coordinator-home'),
    path('search', search, name='search'),  # Existing route
    path('candidateView/<int:candidate_id>/', candidate_view, name='candidate_view'),  # Existing route
    path('employer_view/<int:employer_id>/', employer_view, name='employer_view'),  # Existing route
    path('job_posting_view/<int:job_id>/', job_posting_view, name='job_posting_view'),  # Existing route
    path('job_application_view/<int:application_id>/', job_application_view, name='job_application_view'),  # New route
]