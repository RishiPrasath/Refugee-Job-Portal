from django.urls import path
from .views import home, addJobPosting, getJobPostings, getJobDetails

urlpatterns = [
    path('', home, name='employer-home'),
    path('addJobPosting/', addJobPosting, name='addJobPosting'),
    path('getJobPostings/', getJobPostings, name='getJobPostings'),
    path('getJobDetails/<int:job_id>/<str:username>/', getJobDetails, name='getJobDetails'),
]