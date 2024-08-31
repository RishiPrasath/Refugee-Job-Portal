from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rjb.models import CandidateProfile, CaseWorkerProfile, Skill, Qualification, WorkExperience , EmployerProfile, HiringCoordinatorProfile, User
import json
import io
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()

class RegisterCandidateTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.case_worker_user = User.objects.create_user(username='case_worker', password='password', email='case_worker@example.com', role='Case Worker')
        self.case_worker_profile = CaseWorkerProfile.objects.create(user=self.case_worker_user, full_name='Test Case Worker')

    def test_register_candidate(self):
        print("Running test_register_candidate")
        url = reverse('register_candidate')
        
        # Create a dummy profile picture file
        profile_picture = SimpleUploadedFile("profile_picture.jpg", b"file_content", content_type="image/jpeg")
        
        response = self.client.post(url, {
            'username': 'test_candidate',
            'password': 'password',
            'email': 'test_candidate@example.com',
            'role': 'Candidate',
            'full_name': 'Test Candidate',
            'contact_phone': '1234567890',
            'date_of_birth': '1990-01-01',
            'emergency_contact_name': 'Test Emergency Contact',
            'emergency_contact_phone': '1234567890',
            'summary': 'Test Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/test_candidate',
            'github_profile': 'https://github.com/test_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Python,Django,REST',
            'qualifications': json.dumps([{
                'school': 'Test University',
                'qualification': 'BSc Computer Science',
                'startYear': '2008',
                'endYear': '2012'
            }]),
            'workExperiences': json.dumps([{
                'company': 'Test Company',
                'role': 'Software Developer',
                'startYear': '2013',
                'endYear': '2018',
                'skills': ['Python', 'Django'],
                'description': 'Developed web applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Candidate registration successful')

        # Verify that the candidate profile was created
        candidate_profile = CandidateProfile.objects.get(user__username='test_candidate')
        self.assertEqual(candidate_profile.full_name, 'Test Candidate')
        self.assertEqual(candidate_profile.contact_phone, '1234567890')
        self.assertEqual(candidate_profile.linkedin_profile, 'https://www.linkedin.com/in/test_candidate')
        self.assertEqual(candidate_profile.github_profile, 'https://github.com/test_candidate')
        self.assertEqual(candidate_profile.summary, 'Test Summary')
        self.assertEqual(candidate_profile.skills.count(), 3)  # Check if skills were added
        self.assertEqual(candidate_profile.qualification_set.count(), 1)  # Check if qualifications were added
        self.assertEqual(candidate_profile.workexperience_set.count(), 1)  # Check if work experience was added

    def test_duplicate_username(self):
        print("Running test_duplicate_username")
        url = reverse('register_candidate')
        
        # Create a dummy profile picture file
        profile_picture = SimpleUploadedFile("profile_picture.jpg", b"file_content", content_type="image/jpeg")
        
        # First registration attempt
        response = self.client.post(url, {
            'username': 'duplicate_candidate',
            'password': 'password',
            'email': 'duplicate_candidate@example.com',
            'role': 'Candidate',
            'full_name': 'Duplicate Candidate',
            'contact_phone': '1234567890',
            'date_of_birth': '1990-01-01',
            'emergency_contact_name': 'Test Emergency Contact',
            'emergency_contact_phone': '1234567890',
            'summary': 'Test Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/duplicate_candidate',
            'github_profile': 'https://github.com/duplicate_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Python,Django,REST',
            'qualifications': json.dumps([{
                'school': 'Test University',
                'qualification': 'BSc Computer Science',
                'startYear': '2008',
                'endYear': '2012'
            }]),
            'workExperiences': json.dumps([{
                'company': 'Test Company',
                'role': 'Software Developer',
                'startYear': '2013',
                'endYear': '2018',
                'skills': ['Python', 'Django'],
                'description': 'Developed web applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Candidate registration successful')

        # Second registration attempt with the same username
        response = self.client.post(url, {
            'username': 'duplicate_candidate',  # Same username as before
            'password': 'password',
            'email': 'new_email@example.com',  # Different email
            'role': 'Candidate',
            'full_name': 'New Candidate',
            'contact_phone': '0987654321',
            'date_of_birth': '1991-01-01',
            'emergency_contact_name': 'New Emergency Contact',
            'emergency_contact_phone': '0987654321',
            'summary': 'New Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/new_candidate',
            'github_profile': 'https://github.com/new_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Java,Spring,REST',
            'qualifications': json.dumps([{
                'school': 'New University',
                'qualification': 'MSc Computer Science',
                'startYear': '2012',
                'endYear': '2014'
            }]),
            'workExperiences': json.dumps([{
                'company': 'New Company',
                'role': 'Senior Developer',
                'startYear': '2015',
                'endYear': '2020',
                'skills': ['Java', 'Spring'],
                'description': 'Developed enterprise applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'A user with this username already exists')

    def test_duplicate_email(self):
        print("Running test_duplicate_email")
        url = reverse('register_candidate')
        
        # Create a dummy profile picture file
        profile_picture = SimpleUploadedFile("profile_picture.jpg", b"file_content", content_type="image/jpeg")
        
        # First registration attempt
        response = self.client.post(url, {
            'username': 'unique_candidate',
            'password': 'password',
            'email': 'duplicate_email@example.com',
            'role': 'Candidate',
            'full_name': 'Unique Candidate',
            'contact_phone': '1234567890',
            'date_of_birth': '1990-01-01',
            'emergency_contact_name': 'Test Emergency Contact',
            'emergency_contact_phone': '1234567890',
            'summary': 'Test Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/unique_candidate',
            'github_profile': 'https://github.com/unique_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Python,Django,REST',
            'qualifications': json.dumps([{
                'school': 'Test University',
                'qualification': 'BSc Computer Science',
                'startYear': '2008',
                'endYear': '2012'
            }]),
            'workExperiences': json.dumps([{
                'company': 'Test Company',
                'role': 'Software Developer',
                'startYear': '2013',
                'endYear': '2018',
                'skills': ['Python', 'Django'],
                'description': 'Developed web applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Candidate registration successful')

        # Second registration attempt with the same email
        response = self.client.post(url, {
            'username': 'new_candidate',  # Different username
            'password': 'password',
            'email': 'duplicate_email@example.com',  # Same email as before
            'role': 'Candidate',
            'full_name': 'New Candidate',
            'contact_phone': '0987654321',
            'date_of_birth': '1991-01-01',
            'emergency_contact_name': 'New Emergency Contact',
            'emergency_contact_phone': '0987654321',
            'summary': 'New Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/new_candidate',
            'github_profile': 'https://github.com/new_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Java,Spring,REST',
            'qualifications': json.dumps([{
                'school': 'New University',
                'qualification': 'MSc Computer Science',
                'startYear': '2012',
                'endYear': '2014'
            }]),
            'workExperiences': json.dumps([{
                'company': 'New Company',
                'role': 'Senior Developer',
                'startYear': '2015',
                'endYear': '2020',
                'skills': ['Java', 'Spring'],
                'description': 'Developed enterprise applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'A user with this email already exists')

    def test_missing_required_fields(self):
        print("Running test_missing_required_fields")
        url = reverse('register_candidate')
        
        # Create a dummy profile picture file
        profile_picture = SimpleUploadedFile("profile_picture.jpg", b"file_content", content_type="image/jpeg")
        
        # Missing required fields
        response = self.client.post(url, {
            'username': 'incomplete_candidate',
            'password': 'password',
            'email': 'incomplete_candidate@example.com',
            'role': 'Candidate',
            'full_name': 'Incomplete Candidate',
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_case_worker_assignment(self):
        print("Running test_case_worker_assignment")
        url = reverse('register_candidate')
        
        # Create a dummy profile picture file
        profile_picture = SimpleUploadedFile("profile_picture.jpg", b"file_content", content_type="image/jpeg")
        
        response = self.client.post(url, {
            'username': 'case_worker_candidate',
            'password': 'password',
            'email': 'case_worker_candidate@example.com',
            'role': 'Candidate',
            'full_name': 'Case Worker Candidate',
            'contact_phone': '1234567890',
            'date_of_birth': '1990-01-01',
            'emergency_contact_name': 'Test Emergency Contact',
            'emergency_contact_phone': '1234567890',
            'summary': 'Test Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/case_worker_candidate',
            'github_profile': 'https://github.com/case_worker_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Python,Django,REST',
            'qualifications': json.dumps([{
                'school': 'Test University',
                'qualification': 'BSc Computer Science',
                'startYear': '2008',
                'endYear': '2012'
            }]),
            'workExperiences': json.dumps([{
                'company': 'Test Company',
                'role': 'Software Developer',
                'startYear': '2013',
                'endYear': '2018',
                'skills': ['Python', 'Django'],
                'description': 'Developed web applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Candidate registration successful')

        # Verify that the candidate profile was created and assigned a case worker
        candidate_profile = CandidateProfile.objects.get(user__username='case_worker_candidate')
        self.assertEqual(candidate_profile.case_worker, self.case_worker_profile)

    def test_skills_creation(self):
        print("Running test_skills_creation")
        url = reverse('register_candidate')
        
        # Create a dummy profile picture file
        profile_picture = SimpleUploadedFile("profile_picture.jpg", b"file_content", content_type="image/jpeg")
        
        response = self.client.post(url, {
            'username': 'skills_candidate',
            'password': 'password',
            'email': 'skills_candidate@example.com',
            'role': 'Candidate',
            'full_name': 'Skills Candidate',
            'contact_phone': '1234567890',
            'date_of_birth': '1990-01-01',
            'emergency_contact_name': 'Test Emergency Contact',
            'emergency_contact_phone': '1234567890',
            'summary': 'Test Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/skills_candidate',
            'github_profile': 'https://github.com/skills_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Python,Django,REST',
            'qualifications': json.dumps([{
                'school': 'Test University',
                'qualification': 'BSc Computer Science',
                'startYear': '2008',
                'endYear': '2012'
            }]),
            'workExperiences': json.dumps([{
                'company': 'Test Company',
                'role': 'Software Developer',
                'startYear': '2013',
                'endYear': '2018',
                'skills': ['Python', 'Django'],
                'description': 'Developed web applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Candidate registration successful')

        # Verify that the skills were created and associated with the candidate
        candidate_profile = CandidateProfile.objects.get(user__username='skills_candidate')
        self.assertEqual(candidate_profile.skills.count(), 3)  # Check if skills were added

    def test_qualifications_creation(self):
        print("Running test_qualifications_creation")
        url = reverse('register_candidate')
        
        # Create a dummy profile picture file
        profile_picture = SimpleUploadedFile("profile_picture.jpg", b"file_content", content_type="image/jpeg")
        
        response = self.client.post(url, {
            'username': 'qualifications_candidate',
            'password': 'password',
            'email': 'qualifications_candidate@example.com',
            'role': 'Candidate',
            'full_name': 'Qualifications Candidate',
            'contact_phone': '1234567890',
            'date_of_birth': '1990-01-01',
            'emergency_contact_name': 'Test Emergency Contact',
            'emergency_contact_phone': '1234567890',
            'summary': 'Test Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/qualifications_candidate',
            'github_profile': 'https://github.com/qualifications_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Python,Django,REST',
            'qualifications': json.dumps([{
                'school': 'Test University',
                'qualification': 'BSc Computer Science',
                'startYear': '2008',
                'endYear': '2012'
            }]),
            'workExperiences': json.dumps([{
                'company': 'Test Company',
                'role': 'Software Developer',
                'startYear': '2013',
                'endYear': '2018',
                'skills': ['Python', 'Django'],
                'description': 'Developed web applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Candidate registration successful')

        # Verify that the qualifications were created and associated with the candidate
        candidate_profile = CandidateProfile.objects.get(user__username='qualifications_candidate')
        self.assertEqual(candidate_profile.qualification_set.count(), 1)  # Check if qualifications were added

    def test_work_experience_creation(self):
        print("Running test_work_experience_creation")
        url = reverse('register_candidate')
        
        # Create a dummy profile picture file
        profile_picture = SimpleUploadedFile("profile_picture.jpg", b"file_content", content_type="image/jpeg")
        
        response = self.client.post(url, {
            'username': 'work_experience_candidate',
            'password': 'password',
            'email': 'work_experience_candidate@example.com',
            'role': 'Candidate',
            'full_name': 'Work Experience Candidate',
            'contact_phone': '1234567890',
            'date_of_birth': '1990-01-01',
            'emergency_contact_name': 'Test Emergency Contact',
            'emergency_contact_phone': '1234567890',
            'summary': 'Test Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/work_experience_candidate',
            'github_profile': 'https://github.com/work_experience_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Python,Django,REST',
            'qualifications': json.dumps([{
                'school': 'Test University',
                'qualification': 'BSc Computer Science',
                'startYear': '2008',
                'endYear': '2012'
            }]),
            'workExperiences': json.dumps([{
                'company': 'Test Company',
                'role': 'Software Developer',
                'startYear': '2013',
                'endYear': '2018',
                'skills': ['Python', 'Django'],
                'description': 'Developed web applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Candidate registration successful')

        # Verify that the work experiences were created and associated with the candidate
        candidate_profile = CandidateProfile.objects.get(user__username='work_experience_candidate')
        self.assertEqual(candidate_profile.workexperience_set.count(), 1)  # Check if work experience was added

    def test_profile_picture_upload(self):
        print("Running test_profile_picture_upload")
        url = reverse('register_candidate')
        
        # Create a dummy profile picture
        profile_picture = SimpleUploadedFile("profile_picture.jpg", b"file_content", content_type="image/jpeg")
        
        response = self.client.post(url, {
            'username': 'profile_picture_candidate',
            'password': 'password',
            'email': 'profile_picture_candidate@example.com',
            'role': 'Candidate',
            'full_name': 'Profile Picture Candidate',
            'contact_phone': '1234567890',
            'date_of_birth': '1990-01-01',
            'emergency_contact_name': 'Test Emergency Contact',
            'emergency_contact_phone': '1234567890',
            'summary': 'Test Summary',
            'linkedin_profile': 'https://www.linkedin.com/in/profile_picture_candidate',
            'github_profile': 'https://github.com/profile_picture_candidate',
            'accessibility_requirements': 'None',
            'immigration_status': 'Citizen',
            'skills': 'Python,Django,REST',
            'qualifications': json.dumps([{
                'school': 'Test University',
                'qualification': 'BSc Computer Science',
                'startYear': '2008',
                'endYear': '2012'
            }]),
            'workExperiences': json.dumps([{
                'company': 'Test Company',
                'role': 'Software Developer',
                'startYear': '2013',
                'endYear': '2018',
                'skills': ['Python', 'Django'],
                'description': 'Developed web applications.'
            }]),
            'profile_picture': profile_picture
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Candidate registration successful')

        # Verify that the profile picture was uploaded and associated with the candidate
        candidate_profile = CandidateProfile.objects.get(user__username='profile_picture_candidate')
        self.assertIsNotNone(candidate_profile.profile_picture)  # Check if profile picture was uploaded

class RegisterEmployerTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_successful_registration(self):
        print("Running test_successful_registration")
        url = reverse('register_employer')
        
        # Create a dummy logo file
        logo = SimpleUploadedFile("logo.jpg", b"file_content", content_type="image/jpeg")
        
        response = self.client.post(url, {
            'username': 'test_employer',
            'password': 'password',
            'email': 'test_employer@example.com',
            'role': 'Employer',
            'company_name': 'Test Company',
            'contact_phone': '1234567890',
            'location': 'Test Location',
            'industry': 'Tech',
            'logo': logo
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Employer registration successful')

        # Verify that the employer profile was created
        employer_profile = EmployerProfile.objects.get(user__username='test_employer')
        self.assertEqual(employer_profile.company_name, 'Test Company')
        self.assertEqual(employer_profile.contact_phone, '1234567890')
        self.assertEqual(employer_profile.location, 'Test Location')
        self.assertEqual(employer_profile.industry, 'Tech')
        self.assertIsNotNone(employer_profile.logo)  # Check if logo was uploaded

    def test_duplicate_username(self):
        print("Running test_duplicate_username")
        url = reverse('register_employer')
        
        # Create a dummy logo file
        logo = SimpleUploadedFile("logo.jpg", b"file_content", content_type="image/jpeg")
        
        # First registration attempt
        response = self.client.post(url, {
            'username': 'duplicate_employer',
            'password': 'password',
            'email': 'duplicate_employer@example.com',
            'role': 'Employer',
            'company_name': 'Duplicate Company',
            'contact_phone': '1234567890',
            'location': 'Test Location',
            'industry': 'Tech',
            'logo': logo
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Employer registration successful')

        # Second registration attempt with the same username
        response = self.client.post(url, {
            'username': 'duplicate_employer',  # Same username as before
            'password': 'password',
            'email': 'new_email@example.com',  # Different email
            'role': 'Employer',
            'company_name': 'New Company',
            'contact_phone': '0987654321',
            'location': 'New Location',
            'industry': 'Finance',
            'logo': logo
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'A user with this username already exists')

    def test_duplicate_email(self):
        print("Running test_duplicate_email")
        url = reverse('register_employer')
        
        # Create a dummy logo file
        logo = SimpleUploadedFile("logo.jpg", b"file_content", content_type="image/jpeg")
        
        # First registration attempt
        response = self.client.post(url, {
            'username': 'unique_employer',
            'password': 'password',
            'email': 'duplicate_email@example.com',
            'role': 'Employer',
            'company_name': 'Unique Company',
            'contact_phone': '1234567890',
            'location': 'Test Location',
            'industry': 'Tech',
            'logo': logo
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Employer registration successful')

        # Second registration attempt with the same email
        response = self.client.post(url, {
            'username': 'new_employer',
            'password': 'password',
            'email': 'duplicate_email@example.com',  # Same email as before
            'role': 'Employer',
            'company_name': 'New Company',
            'contact_phone': '0987654321',
            'location': 'New Location',
            'industry': 'Finance',
            'logo': logo
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'A user with this email already exists')

    def test_missing_required_fields(self):
        print("Running test_missing_required_fields")
        url = reverse('register_employer')
        
        # Create a dummy logo file
        logo = SimpleUploadedFile("logo.jpg", b"file_content", content_type="image/jpeg")
        
        # Missing required fields
        response = self.client.post(url, {
            'username': 'incomplete_employer',
            'password': 'password',
            'email': 'incomplete_employer@example.com',
            'role': 'Employer',
            'logo': logo
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_logo_upload(self):
        print("Running test_logo_upload")
        url = reverse('register_employer')
        
        # Create a dummy logo file
        logo = SimpleUploadedFile("logo.jpg", b"file_content", content_type="image/jpeg")
        
        response = self.client.post(url, {
            'username': 'logo_employer',
            'password': 'password',
            'email': 'logo_employer@example.com',
            'role': 'Employer',
            'company_name': 'Logo Company',
            'contact_phone': '1234567890',
            'location': 'Test Location',
            'industry': 'Tech',
            'logo': logo
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Employer registration successful')

        # Verify that the logo was uploaded and associated with the employer
        employer_profile = EmployerProfile.objects.get(user__username='logo_employer')
        self.assertIsNotNone(employer_profile.logo)  # Check if logo was uploaded

class RegisterHiringCoordinatorTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_successful_registration(self):
        print("Running test_successful_registration")
        url = reverse('register_hiring_coordinator')
        
        response = self.client.post(url, {
            'username': 'test_hiring_coordinator',
            'password': 'password',
            'email': 'test_hiring_coordinator@example.com',
            'role': 'Hiring Coordinator',
            'full_name': 'Test Hiring Coordinator'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Hiring Coordinator registration successful')

        # Verify that the hiring coordinator profile was created
        hiring_coordinator_profile = HiringCoordinatorProfile.objects.get(user__username='test_hiring_coordinator')
        self.assertEqual(hiring_coordinator_profile.full_name, 'Test Hiring Coordinator')

    def test_duplicate_username(self):
        print("Running test_duplicate_username")
        url = reverse('register_hiring_coordinator')
        
        # First registration attempt
        response = self.client.post(url, {
            'username': 'duplicate_hiring_coordinator',
            'password': 'password',
            'email': 'duplicate_hiring_coordinator@example.com',
            'role': 'Hiring Coordinator',
            'full_name': 'Duplicate Hiring Coordinator'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Hiring Coordinator registration successful')

        # Second registration attempt with the same username
        response = self.client.post(url, {
            'username': 'duplicate_hiring_coordinator',  # Same username as before
            'password': 'password',
            'email': 'new_email@example.com',  # Different email
            'role': 'Hiring Coordinator',
            'full_name': 'New Hiring Coordinator'
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'A user with this username already exists')

    def test_duplicate_email(self):
        print("Running test_duplicate_email")
        url = reverse('register_hiring_coordinator')
        
        # First registration attempt
        response = self.client.post(url, {
            'username': 'unique_hiring_coordinator',
            'password': 'password',
            'email': 'duplicate_email@example.com',
            'role': 'Hiring Coordinator',
            'full_name': 'Unique Hiring Coordinator'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Hiring Coordinator registration successful')

        # Second registration attempt with the same email
        response = self.client.post(url, {
            'username': 'new_hiring_coordinator',
            'password': 'password',
            'email': 'duplicate_email@example.com',  # Same email as before
            'role': 'Hiring Coordinator',
            'full_name': 'New Hiring Coordinator'
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'A user with this email already exists')

    def test_missing_required_fields(self):
        print("Running test_missing_required_fields")
        url = reverse('register_hiring_coordinator')
        
        # Missing required fields
        response = self.client.post(url, {
            'username': 'incomplete_hiring_coordinator',
            'password': 'password',
            'email': 'incomplete_hiring_coordinator@example.com',
            'role': 'Hiring Coordinator'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

class RegisterCaseWorkerTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_successful_registration(self):
        print("Running test_successful_registration")
        url = reverse('register_case_worker')
        
        response = self.client.post(url, {
            'username': 'test_case_worker',
            'password': 'password',
            'email': 'test_case_worker@example.com',
            'role': 'Case Worker',
            'full_name': 'Test Case Worker'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Case Worker registration successful')

        # Verify that the case worker profile was created
        case_worker_profile = CaseWorkerProfile.objects.get(user__username='test_case_worker')
        self.assertEqual(case_worker_profile.full_name, 'Test Case Worker')

    def test_duplicate_username(self):
        print("Running test_duplicate_username")
        url = reverse('register_case_worker')
        
        # First registration attempt
        response = self.client.post(url, {
            'username': 'duplicate_case_worker',
            'password': 'password',
            'email': 'duplicate_case_worker@example.com',
            'role': 'Case Worker',
            'full_name': 'Duplicate Case Worker'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Case Worker registration successful')

        # Second registration attempt with the same username
        response = self.client.post(url, {
            'username': 'duplicate_case_worker',  # Same username as before
            'password': 'password',
            'email': 'new_email@example.com',  # Different email
            'role': 'Case Worker',
            'full_name': 'New Case Worker'
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'A user with this username already exists')

    def test_duplicate_email(self):
        print("Running test_duplicate_email")
        url = reverse('register_case_worker')
        
        # First registration attempt
        response = self.client.post(url, {
            'username': 'unique_case_worker',
            'password': 'password',
            'email': 'duplicate_email@example.com',
            'role': 'Case Worker',
            'full_name': 'Unique Case Worker'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Case Worker registration successful')

        # Second registration attempt with the same email
        response = self.client.post(url, {
            'username': 'new_case_worker',
            'password': 'password',
            'email': 'duplicate_email@example.com',  # Same email as before
            'role': 'Case Worker',
            'full_name': 'New Case Worker'
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'A user with this email already exists')

    def test_missing_required_fields(self):
        print("Running test_missing_required_fields")
        url = reverse('register_case_worker')
        
        # Missing required fields
        response = self.client.post(url, {
            'username': 'incomplete_case_worker',
            'password': 'password',
            'email': 'incomplete_case_worker@example.com',
            'role': 'Case Worker'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
