from django.test import TestCase, Client
from django.urls import reverse
from rjb.models import User, CandidateProfile, CaseWorkerProfile, JobPosting, Application, Interview, JobOffer, Notification, Event, ChatGroup, Message
from unittest.mock import patch
import json

class GetCandidateProfileTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testcandidate', email='testcandidate@example.com', password='testpass')
        self.candidate_profile = CandidateProfile.objects.create(user=self.user, full_name='Test Candidate')
        
    def test_successful_retrieval(self):
        url = reverse('get_candidate_profile')
        response = self.client.get(url, {'email': 'testcandidate@example.com'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('candidate_profile', response.json())

    def test_user_not_found(self):
        url = reverse('get_candidate_profile')
        response = self.client.get(url, {'email': 'nonexistent@example.com'})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User does not exist')

    def test_missing_email(self):
        url = reverse('get_candidate_profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Email is required')

class GetAssignedCandidatesTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.case_worker = User.objects.create_user(username='testcaseworker', email='testcaseworker@example.com', password='testpass')
        self.case_worker_profile = CaseWorkerProfile.objects.create(user=self.case_worker, full_name='Test Case Worker')
        self.candidate = User.objects.create_user(username='testcandidate', email='testcandidate@example.com', password='testpass')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate, full_name='Test Candidate', case_worker=self.case_worker_profile)

    def test_successful_retrieval(self):
        url = reverse('get_assigned_candidates')
        response = self.client.get(url, {'username': 'testcaseworker', 'email': 'testcaseworker@example.com'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('candidates', response.json())

    def test_user_not_found(self):
        url = reverse('get_assigned_candidates')
        response = self.client.get(url, {'username': 'nonexistent', 'email': 'nonexistent@example.com'})
        self.assertEqual(response.status_code, 404)

class CreateCandidateTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.case_worker = User.objects.create_user(username='testcaseworker', email='testcaseworker@example.com', password='testpass')
        self.case_worker_profile = CaseWorkerProfile.objects.create(user=self.case_worker, full_name='Test Case Worker')

    def test_successful_creation(self):
        url = reverse('create_candidate')
        data = {
            'username': 'newcandidate',
            'email': 'newcandidate@example.com',
            'password': 'newpass',
            'full_name': 'New Candidate',
            'case_worker_username': 'testcaseworker',
            'case_worker_email': 'testcaseworker@example.com'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], 'Candidate registration successful')

    def test_missing_required_fields(self):
        url = reverse('create_candidate')
        data = {
            'username': 'newcandidate'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertIn('is required', response.json()['error'])

    def test_exception_handling(self):
        url = reverse('create_candidate')
        data = {
            'username': 'newcandidate',
            'email': 'newcandidate@example.com',
            'password': 'newpass',
            'full_name': 'New Candidate',
            'case_worker_username': 'nonexistent',
            'case_worker_email': 'nonexistent@example.com'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertIn('Case worker not found', response.json()['error'])

