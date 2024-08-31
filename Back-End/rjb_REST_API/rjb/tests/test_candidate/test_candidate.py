from django.test import TestCase, Client
from django.urls import reverse
from rjb.models import User, JobPosting, EmployerProfile, CandidateProfile, CandidateSavesJobPosting, Skill, JobOffer, Application, Qualification

class SearchJobPostingsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.employer = EmployerProfile.objects.create(
            user=User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer'),
            company_name='Test Company',
            industry='Tech',
            contact_phone='1234567890',
            location='Test Location'
        )
        self.skill = Skill.objects.create(skill_name='Python')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Experience with Python',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Yearly',
            job_type='Full-time',
            employment_term='Permanent',
            status='Open',
            ISL=True
        )
        self.job_posting.skills.add(self.skill)

    def test_successful_search(self):
        print("Running test_successful_search")
        url = reverse('searchJobPostings')
        response = self.client.get(url, {'q': 'Software Engineer'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()) > 0)
        self.assertEqual(response.json()[0]['title'], 'Software Engineer')

    def test_no_results(self):
        print("Running test_no_results")
        url = reverse('searchJobPostings')
        response = self.client.get(url, {'q': 'Non-existent Job'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)

    def test_filter_by_immigration_status(self):
        print("Running test_filter_by_immigration_status")
        url = reverse('searchJobPostings')
        response = self.client.get(url, {'q': 'Software Engineer', 'immigration_status': 'Asylum Seeker'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()) > 0)
        self.assertEqual(response.json()[0]['title'], 'Software Engineer')
        self.assertTrue(response.json()[0]['immigrationSalaryList'])

    

class SaveJobTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.user, full_name='Candidate User')
        self.employer = EmployerProfile.objects.create(
            user=User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer'),
            company_name='Test Company',
            industry='Tech',
            contact_phone='1234567890',
            location='Test Location'
        )
        self.job_posting = JobPosting.objects.create(
            employer=self.employer,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Experience with Python',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Yearly',
            job_type='Full-time',
            employment_term='Permanent',
            status='Open',
            ISL=True
        )

    def test_successful_save(self):
        print("Running test_successful_save")
        url = reverse('saveJob')
        response = self.client.post(url, {
            'email': 'candidate@example.com',
            'username': 'candidate',
            'job_title': 'Software Engineer',
            'company_name': 'Test Company'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['message'], 'Job saved successfully')

    def test_duplicate_save(self):
        print("Running test_duplicate_save")
        CandidateSavesJobPosting.objects.create(candidate=self.candidate_profile, job_posting=self.job_posting)
        url = reverse('saveJob')
        response = self.client.post(url, {
            'email': 'candidate@example.com',
            'username': 'candidate',
            'job_title': 'Software Engineer',
            'company_name': 'Test Company'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Job already saved')

    def test_user_not_found(self):
        print("Running test_user_not_found")
        url = reverse('saveJob')
        response = self.client.post(url, {
            'email': 'nonexistent@example.com',
            'username': 'nonexistent',
            'job_title': 'Software Engineer',
            'company_name': 'Test Company'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found')

    def test_candidate_profile_not_found(self):
        print("Running test_candidate_profile_not_found")
        self.candidate_profile.delete()  # Remove the candidate profile to simulate candidate profile not found
        url = reverse('saveJob')
        response = self.client.post(url, {
            'email': 'candidate@example.com',
            'username': 'candidate',
            'job_title': 'Software Engineer',
            'company_name': 'Test Company'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Candidate profile not found')

    def test_job_posting_not_found(self):
        print("Running test_job_posting_not_found")
        url = reverse('saveJob')
        response = self.client.post(url, {
            'email': 'candidate@example.com',
            'username': 'candidate',
            'job_title': 'Non-existent Job',
            'company_name': 'Test Company'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Job posting not found')

class GetSavedJobsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.user, full_name='Candidate User')
        self.employer = EmployerProfile.objects.create(
            user=User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer'),
            company_name='Test Company',
            industry='Tech',
            contact_phone='1234567890',
            location='Test Location'
        )
        self.job_posting = JobPosting.objects.create(
            employer=self.employer,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Experience with Python',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Yearly',
            job_type='Full-time',
            employment_term='Permanent',
            status='Open',
            ISL=True
        )
        CandidateSavesJobPosting.objects.create(candidate=self.candidate_profile, job_posting=self.job_posting)

    def test_successful_retrieval(self):
        print("Running test_successful_retrieval")
        url = reverse('getSavedJobs')
        response = self.client.get(url, {'email': 'candidate@example.com', 'username': 'candidate'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()) > 0)
        self.assertEqual(response.json()[0]['title'], 'Software Engineer')

    def test_user_not_found(self):
        print("Running test_user_not_found")
        url = reverse('getSavedJobs')
        response = self.client.get(url, {'email': 'nonexistent@example.com', 'username': 'nonexistent'})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found')

    def test_candidate_profile_not_found(self):
        print("Running test_candidate_profile_not_found")
        self.candidate_profile.delete()  # Remove the candidate profile to simulate candidate profile not found
        url = reverse('getSavedJobs')
        response = self.client.get(url, {'email': 'candidate@example.com', 'username': 'candidate'})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Candidate profile not found')

class ApproveJobOfferTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.employer_user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer = EmployerProfile.objects.create(
            user=self.employer_user,
            company_name='Test Company',
            industry='Tech',
            contact_phone='1234567890',
            location='Test Location'
        )
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='Candidate User')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Experience with Python',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Yearly',
            job_type='Full-time',
            employment_term='Permanent',
            status='Pending',
            ISL=True
        )
        self.application = Application.objects.create(
            job=self.job_posting,
            applicant=self.candidate_user,
            status='Pending'
        )
        self.job_offer = JobOffer.objects.create(
            application=self.application,
            job_posting=self.job_posting,
            employer=self.employer,
            candidate=self.candidate_profile,
            status='Pending'
        )

    def test_successful_approval(self):
        print("Running test_successful_approval")
        url = reverse('approveJobOffer', args=[self.job_offer.id])
        response = self.client.post(url, {'job_id': self.job_offer.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Job offer approved successfully')
        self.job_offer.refresh_from_db()
        self.assertEqual(self.job_offer.status, 'Approved')

    def test_job_offer_not_found(self):
        print("Running test_job_offer_not_found")
        url = reverse('approveJobOffer', args=[9999])  # Non-existent job ID
        response = self.client.post(url, {'job_id': 9999})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Job offer not found')

    def test_exception_handling(self):
        print("Running test_exception_handling")
        url = reverse('approveJobOffer', args=[0])  # Invalid job ID
        response = self.client.post(url, {'job_id': 0})
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class RejectJobOfferTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.employer_user = User.objects.create_user(username='employer', password='password', email='employer@example.com', role='Employer')
        self.employer = EmployerProfile.objects.create(
            user=self.employer_user,
            company_name='Test Company',
            industry='Tech',
            contact_phone='1234567890',
            location='Test Location'
        )
        self.candidate_user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.candidate_user, full_name='Candidate User')
        self.job_posting = JobPosting.objects.create(
            employer=self.employer,
            job_title='Software Engineer',
            job_description='Develop software solutions',
            requirements='Experience with Python',
            location='Remote',
            compensation_amount=100000,
            compensation_type='Yearly',
            job_type='Full-time',
            employment_term='Permanent',
            status='Pending',
            ISL=True
        )
        self.application = Application.objects.create(
            job=self.job_posting,
            applicant=self.candidate_user,
            status='Pending'
        )
        self.job_offer = JobOffer.objects.create(
            application=self.application,
            job_posting=self.job_posting,
            employer=self.employer,
            candidate=self.candidate_profile,
            status='Pending'
        )

    def test_successful_rejection(self):
        print("Running test_successful_rejection")
        url = reverse('rejectJobOffer', args=[self.job_offer.id])
        response = self.client.post(url, {'job_id': self.job_offer.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Job offer rejected successfully')
        self.job_offer.refresh_from_db()
        self.assertEqual(self.job_offer.status, 'Rejected')

    def test_job_offer_not_found(self):
        print("Running test_job_offer_not_found")
        url = reverse('rejectJobOffer', args=[9999])  # Non-existent job ID
        response = self.client.post(url, {'job_id': 9999})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Job offer not found')

    def test_exception_handling(self):
        print("Running test_exception_handling")
        url = reverse('rejectJobOffer', args=[0])  # Invalid job ID
        response = self.client.post(url, {'job_id': 0})
        self.assertEqual(response.status_code, 404)
        self.assertTrue('error' in response.json())

class GetAllSkillsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.skill1 = Skill.objects.create(skill_name='Python')
        self.skill2 = Skill.objects.create(skill_name='Django')

    def test_successful_retrieval(self):
        print("Running test_successful_retrieval")
        url = reverse('getAllSkills')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()) > 0)
        self.assertEqual(response.json()[0]['skill_name'], 'Python')
        self.assertEqual(response.json()[1]['skill_name'], 'Django')

class AddWorkExperienceTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.user, full_name='Candidate User')

    def test_successful_addition(self):
        print("Running test_successful_addition")
        url = reverse('addWorkExperience')
        new_experience = {
            'company': 'Test Company',
            'role': 'Software Engineer',
            'start_year': 2020,
            'end_year': 2022,
            'description': 'Developed software solutions'
        }
        response = self.client.post(url, {
            'username': 'candidate',
            'email': 'candidate@example.com',
            'newExperience': new_experience
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Work experience added successfully')

    def test_user_not_found(self):
        print("Running test_user_not_found")
        url = reverse('addWorkExperience')
        new_experience = {
            'company': 'Test Company',
            'role': 'Software Engineer',
            'start_year': 2020,
            'end_year': 2022,
            'description': 'Developed software solutions'
        }
        response = self.client.post(url, {
            'username': 'nonexistent',
            'email': 'nonexistent@example.com',
            'newExperience': new_experience
        }, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found')

    def test_candidate_profile_not_found(self):
        print("Running test_candidate_profile_not_found")
        self.candidate_profile.delete()  # Remove the candidate profile to simulate candidate profile not found
        url = reverse('addWorkExperience')
        new_experience = {
            'company': 'Test Company',
            'role': 'Software Engineer',
            'start_year': 2020,
            'end_year': 2022,
            'description': 'Developed software solutions'
        }
        response = self.client.post(url, {
            'username': 'candidate',
            'email': 'candidate@example.com',
            'newExperience': new_experience
        }, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Candidate profile not found')

    def test_exception_handling(self):
        print("Running test_exception_handling")
        url = reverse('addWorkExperience')
        response = self.client.post(url, {
            'username': 'candidate',
            'email': 'candidate@example.com',
            'newExperience': None  # This will cause an exception
        }, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

    def test_invalid_request_method(self):
        print("Running test_invalid_request_method")
        url = reverse('addWorkExperience')
        response = self.client.get(url)  # Using GET instead of POST
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Invalid request method')

class AddQualificationTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.user, full_name='Candidate User')

    def test_successful_addition(self):
        print("Running test_successful_addition")
        url = reverse('addQualification')
        new_qualification = {
            'school': 'Test University',
            'qualification': 'Bachelor of Science',
            'start_year': 2016,
            'end_year': 2020
        }
        response = self.client.post(url, {
            'username': 'candidate',
            'email': 'candidate@example.com',
            'newQualification': new_qualification
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['school'], 'Test University')
        self.assertEqual(response.json()['qualification'], 'Bachelor of Science')

    def test_user_not_found(self):
        print("Running test_user_not_found")
        url = reverse('addQualification')
        new_qualification = {
            'school': 'Test University',
            'qualification': 'Bachelor of Science',
            'start_year': 2016,
            'end_year': 2020
        }
        response = self.client.post(url, {
            'username': 'nonexistent',
            'email': 'nonexistent@example.com',
            'newQualification': new_qualification
        }, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found')

    def test_candidate_profile_not_found(self):
        print("Running test_candidate_profile_not_found")
        self.candidate_profile.delete()  # Remove the candidate profile to simulate candidate profile not found
        url = reverse('addQualification')
        new_qualification = {
            'school': 'Test University',
            'qualification': 'Bachelor of Science',
            'start_year': 2016,
            'end_year': 2020
        }
        response = self.client.post(url, {
            'username': 'candidate',
            'email': 'candidate@example.com',
            'newQualification': new_qualification
        }, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Candidate profile not found')

    def test_exception_handling(self):
        print("Running test_exception_handling")
        url = reverse('addQualification')
        response = self.client.post(url, {
            'username': 'candidate',
            'email': 'candidate@example.com',
            'newQualification': None  # This will cause an exception
        }, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertTrue('error' in response.json())

    def test_invalid_request_method(self):
        print("Running test_invalid_request_method")
        url = reverse('addQualification')
        response = self.client.get(url)  # Using GET instead of POST
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Invalid request method')

class GetQualificationsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='candidate', password='password', email='candidate@example.com', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.user, full_name='Candidate User')
        self.qualification1 = Qualification.objects.create(
            candidate=self.candidate_profile,
            school='Test University',
            qualification='Bachelor of Science',
            start_year=2016,
            end_year=2020
        )
        self.qualification2 = Qualification.objects.create(
            candidate=self.candidate_profile,
            school='Another University',
            qualification='Master of Science',
            start_year=2021,
            end_year=2023
        )

    def test_successful_retrieval(self):
        print("Running test_successful_retrieval")
        url = reverse('getQualifications')
        response = self.client.get(url, {'username': 'candidate', 'email': 'candidate@example.com'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(response.json()[0]['school'], 'Test University')
        self.assertEqual(response.json()[1]['school'], 'Another University')

    def test_user_not_found(self):
        print("Running test_user_not_found")
        url = reverse('getQualifications')
        response = self.client.get(url, {'username': 'nonexistent', 'email': 'nonexistent@example.com'})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found')

    def test_candidate_profile_not_found(self):
        print("Running test_candidate_profile_not_found")
        self.candidate_profile.delete()  # Remove the candidate profile to simulate candidate profile not found
        url = reverse('getQualifications')
        response = self.client.get(url, {'username': 'candidate', 'email': 'candidate@example.com'})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Candidate profile not found')

    def test_exception_handling(self):
        print("Running test_exception_handling")
        url = reverse('getQualifications')
        response = self.client.get(url, {'username': 'candidate', 'email': 'candidate@example.com', 'invalid_param': 'invalid'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
