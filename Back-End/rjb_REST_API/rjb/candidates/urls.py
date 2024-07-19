from django.urls import path
from .views import home, searchJobPostings, viewJobDetails, getCandidateProfile, saveJob, getSavedJobs, removeSavedJob, submitJobApplication, getAppliedJobs, withdrawApplication, getCandidateUpcomingInterviews

urlpatterns = [
    path('', home, name='candidate-home'),
    path('searchJobPostings', searchJobPostings, name='searchJobPostings'),
    path('viewJobDetails/<str:company>/<int:job_id>/', viewJobDetails, name='view-job-details'),
    path('getCandidateProfile', getCandidateProfile, name='getCandidateProfile'),
    path('saveJob', saveJob, name='saveJob'),
    path('getSavedJobs', getSavedJobs, name='getSavedJobs'),
    path('removeSavedJob', removeSavedJob, name='removeSavedJob'),
    path('submitJobApplication', submitJobApplication, name='submitJobApplication'),
    path('getAppliedJobs', getAppliedJobs, name='getAppliedJobs'),
    path('withdrawApplication', withdrawApplication, name='withdrawApplication'),
    path('getCandidateUpcomingInterviews/', getCandidateUpcomingInterviews, name='getCandidateUpcomingInterviews'),
]