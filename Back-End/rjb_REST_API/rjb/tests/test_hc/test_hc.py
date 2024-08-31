from django.test import TestCase, Client
from django.urls import reverse
from rjb.models import User, CandidateProfile, EmployerProfile, JobPosting, Application, Interview, JobOffer, Event
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import date, time

class EmployerViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testemployer', email='testemployer@example.com', password='testpass')
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name='Test Company')
        self.job_posting = JobPosting.objects.create(employer=self.employer_profile, job_title='Test Job')
        self.candidate = User.objects.create_user(username='testcandidate', email='testcandidate@example.com', password='testpass')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate, full_name='Test Candidate')
        self.application = Application.objects.create(job=self.job_posting, applicant=self.candidate)
        self.interview = Interview.objects.create(application=self.application, interview_type='Virtual')
        self.event = Event.objects.create(owner=self.user, description='Test Event')

    def test_employer_view_success(self):
        url = reverse('employer_view', args=[self.employer_profile.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('company_name', response.json())
        self.assertIn('job_postings', response.json())
        self.assertIn('interviews', response.json())
        self.assertIn('events', response.json())

    def test_employer_view_not_found(self):
        url = reverse('employer_view', args=[999])  # Non-existent ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

class CandidateViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testcandidate', email='testcandidate@example.com', password='testpass')
        self.candidate_profile = CandidateProfile.objects.create(user=self.user, full_name='Test Candidate')
        self.employer = EmployerProfile.objects.create(user=User.objects.create_user(username='testemployer', email='testemployer@example.com', password='testpass'), company_name='Test Company')
        self.job_posting = JobPosting.objects.create(employer=self.employer, job_title='Test Job')
        self.application = Application.objects.create(job=self.job_posting, applicant=self.user)
        self.interview = Interview.objects.create(application=self.application, interview_type='Virtual')
        self.job_offer = JobOffer.objects.create(application=self.application, job_posting=self.job_posting, employer=self.employer, candidate=self.candidate_profile)
        self.event = Event.objects.create(owner=self.user, description='Test Event')

    def test_candidate_view_success(self):
        url = reverse('candidate_view', args=[self.candidate_profile.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('full_name', response.json())
        self.assertIn('qualifications', response.json())
        self.assertIn('work_experiences', response.json())
        self.assertIn('events', response.json())
        self.assertIn('applications', response.json())
        self.assertIn('interviews', response.json())
        self.assertIn('job_offers', response.json())

    def test_candidate_view_not_found(self):
        url = reverse('candidate_view', args=[999])  # Non-existent ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

class SearchViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.candidate = CandidateProfile.objects.create(user=User.objects.create_user(username='testcandidate'), full_name='Test Candidate')
        self.employer = EmployerProfile.objects.create(user=User.objects.create_user(username='testemployer'), company_name='Test Company')
        self.job_posting = JobPosting.objects.create(employer=self.employer, job_title='Test Job')

    def test_search_view(self):
        url = reverse('search')
        response = self.client.get(url, {'q': 'Test'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('candidates', response.json())
        self.assertIn('job_postings', response.json())
        self.assertIn('employers', response.json())

    def test_search_view_no_query(self):
        url = reverse('search')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

class JobApplicationViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.candidate = User.objects.create_user(username='testcandidate', email='testcandidate@example.com', password='testpass')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate, full_name='Test Candidate')
        self.employer = EmployerProfile.objects.create(user=User.objects.create_user(username='testemployer'), company_name='Test Company')
        self.job_posting = JobPosting.objects.create(employer=self.employer, job_title='Test Job')
        self.application = Application.objects.create(job=self.job_posting, applicant=self.candidate)
        self.interview = Interview.objects.create(application=self.application, interview_type='Virtual')
        self.job_offer = JobOffer.objects.create(application=self.application, job_posting=self.job_posting, employer=self.employer, candidate=self.candidate_profile)

    def test_job_application_view_success(self):
        url = reverse('job_application_view', args=[self.application.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('candidateProfile', response.json())
        self.assertIn('application', response.json())
        self.assertIn('interviews', response.json())
        self.assertIn('jobOffer', response.json())

    def test_job_application_view_not_found(self):
        url = reverse('job_application_view', args=[999])  # Non-existent ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
