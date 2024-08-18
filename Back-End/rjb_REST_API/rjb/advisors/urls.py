from django.urls import path
from rjb.advisors.views import *

urlpatterns = [
    path('getCandidateProfile', get_candidate_profile, name='get_candidate_profile'),
    path('getAssignedCandidates', get_assigned_candidates, name='get_assigned_candidates'),
    path('createCandidate', create_candidate, name='create_candidate'),
]