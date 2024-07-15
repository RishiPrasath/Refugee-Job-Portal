from django.urls import path
from . import views

urlpatterns = [
    path('getCandidateProfile', views.get_candidate_profile, name='get_candidate_profile'),
    path('getAssignedCandidates', views.get_assigned_candidates, name='get_assigned_candidates'),
]