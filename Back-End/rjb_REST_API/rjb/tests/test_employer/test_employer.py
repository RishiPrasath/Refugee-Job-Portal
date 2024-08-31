from django.http import Http404
from django.test import TestCase, Client
from django.urls import reverse
from rjb.models import *
from unittest.mock import patch
from django.test import TestCase, Client
from django.http import Http404
import json

class AddJobPostingTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')

    def test_successful_addition(self):
        print("Running test_successful_addition")
        url = reverse('addJobPosting')
        job_data = {
            'company_name': 'Test Company',
            'email': 'employer@example.com',
            'jobTitle': 'Software Engineer',
            'jobDescription': 'Develop software solutions',
            'requirements': ['Python', 'Django'],
            'location': 'Remote',
            'compensationAmount': 100000,
            'compensationType': 'Annual',
            'jobType': 'Full-time',
            'employmentTerm': 'Permanent',
            'ISL': True,  # Changed from 'Yes' to True
            'skills': ['Python', 'Django']
        }
        response = self.client.post(url, job_data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Job posting added successfully')

    def test_employer_not_found(self):
        print("Running test_employer_not_found")
        url = reverse('addJobPosting')
        job_data = {
            'company_name': 'Nonexistent Company',
            'email': 'nonexistent@example.com',
            'jobTitle': 'Software Engineer',
            'jobDescription': 'Develop software solutions',
            'requirements': ['Python', 'Django'],
            'location': 'Remote',
            'compensationAmount': 100000,
            'compensationType': 'Annual',
            'jobType': 'Full-time',
            'employmentTerm': 'Permanent',
            'ISL': True,  # Changed from 'Yes' to True
            'skills': ['Python', 'Django']
        }
        response = self.client.post(url, job_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Employer not found or email does not match.')

    def test_missing_mandatory_fields(self):
        print("Running test_missing_mandatory_fields")
        url = reverse('addJobPosting')
        job_data = {
            'company_name': 'Test Company',
            'email': 'employer@example.com',
            # Missing mandatory fields like jobTitle, jobDescription, etc.
        }
        response = self.client.post(url, job_data, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

    def test_exception_handling(self):
        print("Running test_exception_handling")
        url = reverse('addJobPosting')
        job_data = {
            'company_name': 'Test Company',
            'email': 'employer@example.com',
            'jobTitle': 'Software Engineer',
            'jobDescription': 'Develop software solutions',
            'requirements': ['Python', 'Django'],
            'location': 'Remote',
            'compensationAmount': 'invalid_amount',  # This will cause an exception
            'compensationType': 'Annual',
            'jobType': 'Full-time',
            'employmentTerm': 'Permanent',
            'ISL': True,  # Changed from 'Yes' to True
            'skills': ['Python', 'Django']
        }
        response = self.client.post(url, job_data, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

class GetJobPostingsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer_profile,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Python|Django',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Annual',
            job_type='Full-time',
            employment_term='Permanent',
            ISL=True,
            status='Open'
        )

    def test_successful_retrieval(self):
        print("Running test_successful_retrieval")
        url = reverse('getJobPostings')
        response = self.client.get(url, {'username': 'employer', 'company_name': 'Test Company'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('job_postings' in response.json())
        self.assertEqual(len(response.json()['job_postings']), 1)

    def test_employer_not_found(self):
        print("Running test_employer_not_found")
        url = reverse('getJobPostings')
        response = self.client.get(url, {'username': 'nonexistent', 'company_name': 'Nonexistent Company'})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Employer not found')

    @patch('rjb.employers.views.EmployerProfile.objects.get')
    def test_exception_handling(self, mock_get):
        print("Running test_exception_handling")
        mock_get.side_effect = Exception("Unexpected error")
        url = reverse('getJobPostings')
        response = self.client.get(url, {'username': 'employer', 'company_name': 'Test Company'})
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

class GetJobDetailsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='John Doe')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer_profile,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Python|Django',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Annual',
            job_type='Full-time',
            employment_term='Permanent',
            ISL=True,
            status='Open'
        )
        self.application = Application.objects.create(
            job=self.job_posting,
            applicant=self.candidate_user,
            status='Submitted'
        )

    def test_successful_retrieval(self):
        print("Running test_successful_retrieval")
        url = reverse('getJobDetails', args=[self.job_posting.id, 'employer'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('job_details' in response.json())
        self.assertTrue('applications' in response.json())

    def test_job_not_found(self):
        print("Running test_job_not_found")
        url = reverse('getJobDetails', args=[999, 'employer'])  # Non-existent job ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Job not found')

    def test_employer_not_found(self):
        print("Running test_employer_not_found")
        url = reverse('getJobDetails', args=[self.job_posting.id, 'nonexistent'])  # Non-existent employer username
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Employer not found')

    @patch('rjb.employers.views.EmployerProfile.objects.get')
    def test_exception_handling(self, mock_get):
        print("Running test_exception_handling")
        mock_get.side_effect = Exception("Unexpected error")
        url = reverse('getJobDetails', args=[self.job_posting.id, 'employer'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

class GetCandidateApplicationDetailsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='John Doe')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer_profile,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Python|Django',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Annual',
            job_type='Full-time',
            employment_term='Permanent',
            ISL=True,
            status='Open'
        )
        self.application = Application.objects.create(
            job=self.job_posting,
            applicant=self.candidate_user,
            status='Submitted'
        )

    def test_successful_retrieval(self):
        print("Running test_successful_retrieval")
        url = reverse('getCandidateApplicationDetails', args=[self.application.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('full_name' in response.json())
        self.assertTrue('application' in response.json())

    def test_application_not_found(self):
        print("Running test_application_not_found")
        url = reverse('getCandidateApplicationDetails', args=[999])  # Non-existent application ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Application not found')

    @patch('rjb.models.Application.objects.get')
    def test_candidate_profile_not_found(self, mock_get):
        print("Running test_candidate_profile_not_found")
        mock_get.side_effect = CandidateProfile.DoesNotExist
        url = reverse('getCandidateApplicationDetails', args=[self.application.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Candidate profile not found')

    @patch('rjb.employers.views.Application.objects.get')
    def test_exception_handling(self, mock_get):
        print("Running test_exception_handling")
        mock_get.side_effect = Exception("Unexpected error")
        url = reverse('getCandidateApplicationDetails', args=[self.application.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

class CreateInterviewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='John Doe')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer_profile,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Python|Django',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Annual',
            job_type='Full-time',
            employment_term='Permanent',
            ISL=True,
            status='Open'
        )
        self.application = Application.objects.create(
            job=self.job_posting,
            applicant=self.candidate_user,
            status='Submitted'
        )

    def test_successful_creation(self):
        print("Running test_successful_creation")
        url = reverse('createInterview')
        interview_data = {
            'applicationId': self.application.id,
            'interviewType': 'Technical',
            'date': '2023-10-01',
            'startTime': '10:00:00',
            'endTime': '11:00:00',
            'interviewLocation': 'Zoom',
            'meetingLink': 'https://zoom.us/j/1234567890',
            'additionalDetails': 'Bring your resume'
        }
        response = self.client.post(url, interview_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['message'], 'Interview created successfully')

    def test_application_not_found(self):
        print("Running test_application_not_found")
        url = reverse('createInterview')
        interview_data = {
            'applicationId': 999,  # Non-existent application ID
            'interviewType': 'Technical',
            'date': '2023-10-01',
            'startTime': '10:00:00',
            'endTime': '11:00:00',
            'interviewLocation': 'Zoom',
            'meetingLink': 'https://zoom.us/j/1234567890',
            'additionalDetails': 'Bring your resume'
        }
        response = self.client.post(url, interview_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Application not found')

    @patch('rjb.models.CandidateProfile.objects.get')
    def test_candidate_profile_not_found(self, mock_get):
        print("Running test_candidate_profile_not_found")
        mock_get.side_effect = CandidateProfile.DoesNotExist
        url = reverse('createInterview')
        interview_data = {
            'applicationId': self.application.id,
            'interviewType': 'Technical',
            'date': '2023-10-01',
            'startTime': '10:00:00',
            'endTime': '11:00:00',
            'interviewLocation': 'Zoom',
            'meetingLink': 'https://zoom.us/j/1234567890',
            'additionalDetails': 'Bring your resume'
        }
        response = self.client.post(url, interview_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Candidate profile not found for the applicant')

    def test_missing_application_id(self):
        print("Running test_missing_application_id")
        url = reverse('createInterview')
        interview_data = {
            'interviewType': 'Technical',
            'date': '2023-10-01',
            'startTime': '10:00:00',
            'endTime': '11:00:00',
            'interviewLocation': 'Zoom',
            'meetingLink': 'https://zoom.us/j/1234567890',
            'additionalDetails': 'Bring your resume'
        }
        response = self.client.post(url, interview_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Application ID is required')

    @patch('rjb.employers.views.Application.objects.get')
    def test_exception_handling(self, mock_get):
        print("Running test_exception_handling")
        mock_get.side_effect = Exception("Unexpected error")
        url = reverse('createInterview')
        interview_data = {
            'applicationId': self.application.id,
            'interviewType': 'Technical',
            'date': '2023-10-01',
            'startTime': '10:00:00',
            'endTime': '11:00:00',
            'interviewLocation': 'Zoom',
            'meetingLink': 'https://zoom.us/j/1234567890',
            'additionalDetails': 'Bring your resume'
        }
        response = self.client.post(url, interview_data, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

class GetInterviewsByStatusTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='John Doe')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer_profile,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Python|Django',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Annual',
            job_type='Full-time',
            employment_term='Permanent',
            ISL=True,
            status='Open'
        )
        self.application = Application.objects.create(
            job=self.job_posting,
            applicant=self.candidate_user,
            status='Submitted'
        )
        self.interview = Interview.objects.create(
            application=self.application,
            interview_type='Technical',
            date='2023-10-01',
            start_time='10:00:00',
            end_time='11:00:00',
            interview_location='Zoom',
            meeting_link='https://zoom.us/j/1234567890',
            additional_details='Bring your resume',
            status='Scheduled'
        )

    def test_successful_retrieval(self):
        print("Running test_successful_retrieval")
        url = reverse('getInterviewsByStatus')
        response = self.client.get(url, {'application_id': self.application.id, 'status': 'Scheduled'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('interviews' in response.json())
        self.assertEqual(len(response.json()['interviews']), 1)

    def test_missing_parameters(self):
        print("Running test_missing_parameters")
        url = reverse('getInterviewsByStatus')
        response = self.client.get(url, {'application_id': self.application.id})  # Missing status
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Application ID and status are required parameters.')

    def test_no_interviews_found(self):
        print("Running test_no_interviews_found")
        # Create a new user and employer profile without interviews
        new_user = User.objects.create_user(username='new_employer', password='password', email='new_employer@example.com', role='Employer')
        new_employer = EmployerProfile.objects.create(user=new_user, company_name='Another Company')
        JobPosting.objects.create(
            employer=new_employer,
            job_title='Data Scientist',
            job_description='Analyze data',
            requirements='Python|Pandas',
            location='Remote',
            compensation_amount=120000,
            compensation_type='Annual',
            job_type='Full-time',
            employment_term='Permanent',
            ISL=True,
            status='Open'
        )
        url = reverse('getUpcomingInterviews')
        response = self.client.get(url, {'company_name': 'Another Company'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue('interviews' in response.json())
        self.assertEqual(len(response.json()['interviews']), 0)

    @patch('rjb.employers.views.Interview.objects.filter')
    def test_exception_handling(self, mock_filter):
        print("Running test_exception_handling")
        mock_filter.side_effect = Exception("Unexpected error")
        url = reverse('getInterviewsByStatus')
        response = self.client.get(url, {'application_id': self.application.id, 'status': 'Scheduled'})
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

class UpdateInterviewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='John Doe')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer_profile,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Python|Django',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Annual',
            job_type='Full-time',
            employment_term='Permanent',
            ISL=True,
            status='Open'
        )
        self.application = Application.objects.create(
            job=self.job_posting,
            applicant=self.candidate_user,
            status='Submitted'
        )
        self.interview = Interview.objects.create(
            application=self.application,
            interview_type='Technical',
            date='2023-10-01',
            start_time='10:00:00',
            end_time='11:00:00',
            interview_location='Zoom',
            meeting_link='https://zoom.us/j/1234567890',
            additional_details='Bring your resume',
            status='Scheduled'
        )

    def test_successful_update(self):
        print("Running test_successful_update")
        url = reverse('updateInterview')
        update_data = {
            'id': self.interview.id,
            'interview_type': 'Technical',
            'date': '2023-10-02',
            'start_time': '11:00:00',
            'end_time': '12:00:00',
            'interview_location': 'Google Meet',
            'meeting_link': 'https://meet.google.com/abc-defg-hij',
            'additional_details': 'Prepare for coding challenges',
            'application_id': self.application.id
        }
        response = self.client.post(url, update_data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Interview updated successfully')

    def test_missing_interview_id(self):
        print("Running test_missing_interview_id")
        url = reverse('updateInterview')
        update_data = {
            'interview_type': 'Technical',
            'date': '2023-10-02',
            'start_time': '11:00:00',
            'end_time': '12:00:00',
            'interview_location': 'Google Meet',
            'meeting_link': 'https://meet.google.com/abc-defg-hij',
            'additional_details': 'Prepare for coding challenges'
        }
        response = self.client.post(url, update_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Interview ID is required')

    def test_interview_not_found(self):
        print("Running test_interview_not_found")
        url = reverse('updateInterview')
        update_data = {
            'id': 999,  # Non-existent interview ID
            'interview_type': 'Technical',
            'date': '2023-10-02',
            'start_time': '11:00:00',
            'end_time': '12:00:00',
            'interview_location': 'Google Meet',
            'meeting_link': 'https://meet.google.com/abc-defg-hij',
            'additional_details': 'Prepare for coding challenges'
        }
        response = self.client.post(url, update_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Interview not found')

    def test_application_not_found(self):
        print("Running test_application_not_found")
        url = reverse('updateInterview')
        update_data = {
            'id': self.interview.id,
            'interview_type': 'Technical',
            'date': '2023-10-02',
            'start_time': '11:00:00',
            'end_time': '12:00:00',
            'interview_location': 'Google Meet',
            'meeting_link': 'https://meet.google.com/abc-defg-hij',
            'additional_details': 'Prepare for coding challenges',
            'application_id': 999  # Non-existent application ID
        }
        response = self.client.post(url, update_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Application not found')

    @patch('rjb.employers.views.Interview.objects.get')
    def test_exception_handling(self, mock_get):
        print("Running test_exception_handling")
        mock_get.side_effect = Exception("Unexpected error")
        url = reverse('updateInterview')
        update_data = {
            'id': self.interview.id,
            'interview_type': 'Technical',
            'date': '2023-10-02',
            'start_time': '11:00:00',
            'end_time': '12:00:00',
            'interview_location': 'Google Meet',
            'meeting_link': 'https://meet.google.com/abc-defg-hij',
            'additional_details': 'Prepare for coding challenges'
        }
        response = self.client.post(url, update_data, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

class CancelInterviewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='John Doe')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer_profile,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Python|Django',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Annual',
            job_type='Full-time',
            employment_term='Permanent',
            ISL=True,
            status='Open'
        )
        self.application = Application.objects.create(
            job=self.job_posting,
            applicant=self.candidate_user,
            status='Submitted'
        )
        self.interview = Interview.objects.create(
            application=self.application,
            interview_type='Technical',
            date='2023-10-01',
            start_time='10:00:00',
            end_time='11:00:00',
            interview_location='Zoom',
            meeting_link='https://zoom.us/j/1234567890',
            additional_details='Bring your resume',
            status='Scheduled'
        )

    def test_successful_cancellation(self):
        print("Running test_successful_cancellation")
        url = reverse('cancelInterview')
        cancel_data = {
            'id': self.interview.id
        }
        response = self.client.post(url, cancel_data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Interview cancelled successfully')
        self.interview.refresh_from_db()
        self.assertEqual(self.interview.status, 'Cancelled')

    def test_missing_interview_id(self):
        print("Running test_missing_interview_id")
        url = reverse('cancelInterview')
        cancel_data = {}  # Missing interview ID
        response = self.client.post(url, cancel_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Interview ID is required')

    def test_interview_not_found(self):
        print("Running test_interview_not_found")
        url = reverse('cancelInterview')
        cancel_data = {
            'id': 999  # Non-existent interview ID
        }
        response = self.client.post(url, cancel_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Interview not found')

    @patch('rjb.models.CandidateProfile.objects.get')
    def test_candidate_profile_not_found(self, mock_get):
        print("Running test_candidate_profile_not_found")
        mock_get.side_effect = CandidateProfile.DoesNotExist
        url = reverse('cancelInterview')
        cancel_data = {
            'id': self.interview.id
        }
        response = self.client.post(url, cancel_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Candidate profile not found for the applicant')

    @patch('rjb.employers.views.Interview.objects.get')
    def test_exception_handling(self, mock_get):
        print("Running test_exception_handling")
        mock_get.side_effect = Exception("Unexpected error")
        url = reverse('cancelInterview')
        cancel_data = {
            'id': self.interview.id
        }
        response = self.client.post(url, cancel_data, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

class CloseInterviewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='John Doe')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer_profile,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Python|Django',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Annual',
            job_type='Full-time',
            employment_term='Permanent',
            ISL=True,
            status='Open'
        )
        self.application = Application.objects.create(
            job=self.job_posting,
            applicant=self.candidate_user,
            status='Submitted'
        )
        self.interview = Interview.objects.create(
            application=self.application,
            interview_type='Technical',
            date='2023-10-01',
            start_time='10:00:00',
            end_time='11:00:00',
            interview_location='Zoom',
            meeting_link='https://zoom.us/j/1234567890',
            additional_details='Bring your resume',
            status='Scheduled'
        )

    def test_successful_closure(self):
        print("Running test_successful_closure")
        url = reverse('closeInterview')
        close_data = {
            'id': self.interview.id,
            'feedback': 'Great candidate, but not the right fit for this role.'
        }
        response = self.client.post(url, close_data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Interview closed successfully')
        self.interview.refresh_from_db()
        self.assertEqual(self.interview.status, 'Closed')
        self.assertEqual(self.interview.feedback, 'Great candidate, but not the right fit for this role.')

    def test_missing_interview_id(self):
        print("Running test_missing_interview_id")
        url = reverse('closeInterview')
        close_data = {
            'feedback': 'Feedback for the interview.'
        }
        response = self.client.post(url, close_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Interview ID is required')

    def test_missing_feedback(self):
        print("Running test_missing_feedback")
        url = reverse('closeInterview')
        close_data = {
            'id': self.interview.id
        }
        response = self.client.post(url, close_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Feedback is required')

    def test_interview_not_found(self):
        print("Running test_interview_not_found")
        url = reverse('closeInterview')
        close_data = {
            'id': 999,  # Non-existent interview ID
            'feedback': 'Feedback for the interview.'
        }
        response = self.client.post(url, close_data, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Interview not found')

    @patch('rjb.employers.views.Interview.objects.get')
    def test_exception_handling(self, mock_get):
        print("Running test_exception_handling")
        mock_get.side_effect = Exception("Unexpected error")
        url = reverse('closeInterview')
        close_data = {
            'id': self.interview.id,
            'feedback': 'Feedback for the interview.'
        }
        response = self.client.post(url, close_data, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())






















































































































































































































