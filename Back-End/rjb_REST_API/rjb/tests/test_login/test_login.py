from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rjb.models import CandidateProfile, EmployerProfile, HiringCoordinatorProfile, CaseWorkerProfile
from django.core.files.uploadedfile import SimpleUploadedFile
import json
import base64
import tempfile
import os

User = get_user_model()

class LoginTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='Candidate User')
        self.employer_user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.employer_user, company_name='Employer Company')
        self.hiring_coordinator_user = User.objects.create_user(username='hiring_coordinator', password='password', email='hiring_coordinator@example.com', role='Hiring Coordinator')
        self.hiring_coordinator_profile = HiringCoordinatorProfile.objects.create(user=self.hiring_coordinator_user, full_name='Hiring Coordinator User')
        self.case_worker_user = User.objects.create_user(username='case_worker', password='password', email='case_worker@example.com', role='Case Worker')
        self.case_worker_profile = CaseWorkerProfile.objects.create(user=self.case_worker_user, full_name='Case Worker User')

        # Create temporary image files
        self.temp_image = tempfile.NamedTemporaryFile(suffix=".jpg").name
        with open(self.temp_image, 'wb') as f:
            f.write(b'\xFF\xD8\xFF\xE0' + b'\x00' * 1024)  # Write a minimal JPEG header

    def tearDown(self):
        # Clean up temporary files
        try:
            os.remove(self.temp_image)
        except OSError:
            pass

    def test_successful_login(self):
        print("Running test_successful_login")
        url = reverse('login')
        response = self.client.post(url, json.dumps({'email': 'candidate@example.com', 'password': 'password'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Login successful')

    def test_invalid_credentials(self):
        print("Running test_invalid_credentials")
        url = reverse('login')
        response = self.client.post(url, json.dumps({'email': 'candidate@example.com', 'password': 'wrongpassword'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Incorrect password')

    def test_non_existent_user(self):
        print("Running test_non_existent_user")
        url = reverse('login')
        response = self.client.post(url, json.dumps({'email': 'nonexistent@example.com', 'password': 'password'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'User does not exist')

    def test_role_specific_data(self):
        print("Running test_role_specific_data")
        url = reverse('login')
        
        # Candidate
        response = self.client.post(url, json.dumps({'email': 'candidate@example.com', 'password': 'password'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['role'], 'Candidate')
        
        # Employer
        response = self.client.post(url, json.dumps({'email': 'employer@example.com', 'password': 'password'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['role'], 'Employer')
        
        # Hiring Coordinator
        response = self.client.post(url, json.dumps({'email': 'hiring_coordinator@example.com', 'password': 'password'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['role'], 'Hiring Coordinator')
        
        # Case Worker
        response = self.client.post(url, json.dumps({'email': 'case_worker@example.com', 'password': 'password'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['role'], 'Case Worker')

    def test_profile_picture_encoding(self):
        print("Running test_profile_picture_encoding")
        url = reverse('login')
        
        # Add profile picture to candidate
        with open(self.temp_image, "rb") as image_file:
            profile_picture = SimpleUploadedFile("profile_picture.jpg", image_file.read(), content_type="image/jpeg")
        self.candidate_profile.profile_picture = profile_picture
        self.candidate_profile.save()
        
        response = self.client.post(url, json.dumps({'email': 'candidate@example.com', 'password': 'password'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('profile_picture', response.json())
        self.assertTrue(response.json()['profile_picture'].startswith('/9j/'))  # Check if base64 encoded

    def test_company_logo_encoding(self):
        print("Running test_company_logo_encoding")
        url = reverse('login')
        
        # Add company logo to employer
        with open(self.temp_image, "rb") as image_file:
            company_logo = SimpleUploadedFile("company_logo.jpg", image_file.read(), content_type="image/jpeg")
        self.employer_profile.logo = company_logo
        self.employer_profile.save()
        
        response = self.client.post(url, json.dumps({'email': 'employer@example.com', 'password': 'password'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('company_logo', response.json())
        self.assertTrue(response.json()['company_logo'].startswith('/9j/'))  # Check if base64 encoded