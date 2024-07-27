from django.urls import path
from .views import home, addJobPosting, getJobPostings, getJobDetails, getCandidateApplicationDetails, createInterview, updateInterview, cancelInterview, closeInterview, getInterviewsByStatus, getUpcomingInterviews

urlpatterns = [
    path('', home, name='employer-home'),
    path('addJobPosting/', addJobPosting, name='addJobPosting'),
    path('getJobPostings/', getJobPostings, name='getJobPostings'),
    path('getJobDetails/<int:job_id>/<str:username>/', getJobDetails, name='getJobDetails'),
    path('getCandidateApplicationDetails/<int:application_id>/', getCandidateApplicationDetails, name='getCandidateApplicationDetails'),
    path('createInterview/', createInterview, name='createInterview'),
    path('updateInterview/', updateInterview, name='updateInterview'),
    path('cancelInterview/', cancelInterview, name='cancelInterview'),
    path('closeInterview/', closeInterview, name='closeInterview'),
    path('getInterviewsByStatus/', getInterviewsByStatus, name='getInterviewsByStatus'),
    path('getUpcomingInterviews/', getUpcomingInterviews, name='getUpcomingInterviews'),
]