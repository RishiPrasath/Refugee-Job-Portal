from django.urls import path
from .views import home, searchJobPostings, viewJobDetails, getCandidateProfile, saveJob, getSavedJobs, removeSavedJob, submitJobApplication, getAppliedJobs, withdrawApplication, getCandidateUpcomingInterviews, getCandidateJobOffers, approveJobOffer, rejectJobOffer, getCandidateApplications

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
    path('getCandidateJobOffers', getCandidateJobOffers, name='getCandidateJobOffers'),
    path('approveJobOffer/<int:job_offer_id>/', approveJobOffer, name='approveJobOffer'),
    path('rejectJobOffer/<int:job_offer_id>/', rejectJobOffer, name='rejectJobOffer'),
    path('getCandidateApplications', getCandidateApplications, name='getCandidateApplications'),
]