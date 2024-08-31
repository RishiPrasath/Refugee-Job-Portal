import random
import traceback
from rjb.models import User, CandidateProfile, EmployerProfile, HiringCoordinatorProfile, CaseWorkerProfile
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.contrib.auth import authenticate
from rjb.models import *
import base64
from rjb.notifications.signals import create_candidate
from rjb.notifications.signals import create_employer



@csrf_exempt
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        print('Received Data: ', data)

        user = User.objects.filter(email=email).first()
        if not user:
            print("User does not exist")
            return JsonResponse({"message": "User does not exist", "status": "error"}, status=400)

        if not user.check_password(password):
            print("Incorrect password")
            return JsonResponse({"message": "Incorrect password", "status": "error"}, status=400)

        role = user.role if hasattr(user, 'role') else 'Unknown'
        print("User role: ", role)
        full_name = " "
        company_name = " "
        immigration_status = " "
        accessibility_requirements = " "
        assigned_case_worker = " "
        skills = []
        profile_picture = " "
        company_logo = " "
        # Fetch full name based on user role
        if role == 'Candidate':
            print("User is a candidate")
            candidate_profile = CandidateProfile.objects.get(user=user)
            full_name = candidate_profile.full_name
            immigration_status = candidate_profile.immigration_status
            accessibility_requirements = candidate_profile.accessibility_requirements
            assigned_case_worker = candidate_profile.case_worker.full_name if candidate_profile.case_worker else " "
            skills = [skill.skill_name for skill in candidate_profile.skills.all()]
            print("Skills: ", skills)
            if candidate_profile.profile_picture:
                with open(candidate_profile.profile_picture.path, "rb") as image_file:
                    profile_picture = base64.b64encode(image_file.read()).decode('utf-8')
        elif role == 'Employer':
            print("User is an employer")
            employer_profile = EmployerProfile.objects.get(user=user)
            company_name = employer_profile.company_name
            if employer_profile.logo:
                with open(employer_profile.logo.path, "rb") as image_file:
                    company_logo = base64.b64encode(image_file.read()).decode('utf-8')
                print("Company logo base64: ", company_logo)  # Debugging line
        elif role == 'Hiring Coordinator':
            print("User is a hiring coordinator")
            full_name = HiringCoordinatorProfile.objects.get(user=user).full_name
        elif role == 'Case Worker':
            print("User is a case worker")
            full_name = CaseWorkerProfile.objects.get(user=user).full_name

        response_data = {
            'id': user.id,
            "message": "Login successful",
            "status": "success",
            "username": user.username,
            "email": user.email,
            "role": role,
            "full_name": full_name,
            "company_name": company_name,
            "immigration_status": immigration_status,
            "accessibility_requirements": accessibility_requirements,
            "assigned_case_worker": assigned_case_worker,
            "skills": skills,
            "profile_picture": profile_picture,
            "company_logo": company_logo
        }

        return JsonResponse(response_data)
    except Exception as e:
        print("Exception occurred:", str(e))
        print(traceback.format_exc())  # Print the full traceback for debugging
        return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)    

    
@api_view(['POST'])
def register(request):
    data = {
        "message": "Registration successful",
        "status": "success"
    }
    return Response(data)

def register_candidate(request):
    if request.method == 'POST':
        print("register_candidate view called")  # Debugging statement
        try:
            data = request.POST.dict()
            profile_picture = request.FILES.get('profile_picture')

            # Define mandatory and optional fields
            mandatory_fields = [
                'username', 'password', 'email', 'role', 'full_name', 
                'contact_phone', 'date_of_birth', 'emergency_contact_name', 
                'emergency_contact_phone', 'summary'
            ]
            optional_fields = [
                'profile_picture', 'linkedin_profile', 'github_profile', 
                'accessibility_requirements', 'immigration_status', 
                'skills', 'qualifications', 'workExperiences'
            ]
            
            # Check for missing mandatory fields
            missing_fields = [field for field in mandatory_fields if field not in data]
            if missing_fields:
                return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)
            
            # Check if user already exists
            if User.objects.filter(username=data['username']).exists():
                return JsonResponse({'error': 'A user with this username already exists'}, status=400)
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'A user with this email already exists'}, status=400)
            
            # Create User
            user = User.objects.create_user(
                username=data['username'],
                password=data['password'],
                email=data['email'],
                role=data['role']
            )
            
            # Assign a caseworker to the candidate
            case_workers = CaseWorkerProfile.objects.all()
            if not case_workers.exists():
                return JsonResponse({'error': 'No case workers available'}, status=400)
            
            # Find caseworkers with no candidates assigned
            unassigned_case_workers = case_workers.filter(candidateprofile__isnull=True)
            if unassigned_case_workers.exists():
                case_worker = random.choice(unassigned_case_workers)
            else:
                case_worker = random.choice(case_workers)
            
            # Create CandidateProfile
            candidate_profile = CandidateProfile.objects.create(
                user=user,
                full_name=data['full_name'],
                date_of_birth=data.get('date_of_birth'),
                contact_phone=data.get('contact_phone'),
                emergency_contact_name=data.get('emergency_contact_name'),
                emergency_contact_phone=data.get('emergency_contact_phone'),
                linkedin_profile=data.get('linkedin_profile'),
                github_profile=data.get('github_profile'),
                summary=data.get('summary'),
                accessibility_requirements=data.get('accessibility_requirements'),
                immigration_status=data.get('immigration_status'),
                case_worker=case_worker
            )
            
            # Handle profile picture
            if profile_picture:
                file_path = os.path.join(settings.MEDIA_ROOT, 'profile_pictures', f'{user.id}_{candidate_profile.id}')
                if not os.path.exists(file_path):
                    os.makedirs(file_path)
                fs = FileSystemStorage(location=file_path)
                filename = fs.save(profile_picture.name, profile_picture)
                candidate_profile.profile_picture = os.path.join('profile_pictures', f'{user.id}_{candidate_profile.id}', filename)
                candidate_profile.save()
            
            # Handle skills
            if 'skills' in data:
                skills = data['skills'].split(',')
                for skill_name in skills:
                    skill, created = Skill.objects.get_or_create(skill_name=skill_name.strip())
                    candidate_profile.skills.add(skill)
            
            # Handle qualifications
            if 'qualifications' in data:
                qualifications = json.loads(data['qualifications'])
                for qualification in qualifications:
                    Qualification.objects.create(
                        school=qualification['school'],
                        qualification=qualification['qualification'],
                        start_year=qualification['startYear'],
                        end_year=qualification['endYear'],
                        candidate=candidate_profile
                    )
            
            # Handle work experiences
            if 'workExperiences' in data:
                work_experiences = json.loads(data['workExperiences'])
                for work_experience in work_experiences:
                    work_exp = WorkExperience.objects.create(
                        company=work_experience['company'],
                        role=work_experience['role'],
                        start_year=work_experience['startYear'],
                        end_year=work_experience['endYear'],
                        description=work_experience.get('description'),
                        candidate=candidate_profile
                    )
                    if 'skills' in work_experience:
                        work_exp_skills = work_experience['skills']
                        for skill_name in work_exp_skills:
                            skill, created = Skill.objects.get_or_create(skill_name=skill_name.strip())
                            work_exp.skills.add(skill)

            # Trigger the create_candidate signal
            create_candidate.send(sender=candidate_profile.__class__, candidate_profile=candidate_profile, profile_picture_url=request.build_absolute_uri(candidate_profile.profile_picture.url))

            print("Assigned case worker: ", case_worker.full_name)

            return JsonResponse({'message': 'Candidate registration successful', 'data': data})
        except Exception as e:
            print("Exception occurred:", str(e))
            print(traceback.format_exc())  # Print the full traceback for debugging
            return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)

@csrf_exempt
def register_employer(request):
    if request.method == 'POST':
        try:
            data = request.POST.dict()
            logo = request.FILES.get('logo')

            # Debugging: Print the contents of request.FILES
            print("request.FILES:", request.FILES)
            if logo:
                print("Logo file received:", logo)
            else:
                print("No logo file received")

            # Define mandatory and optional fields
            mandatory_fields = [
                'username', 'password', 'email', 'role', 'company_name', 
                'contact_phone', 'location', 'industry'
            ]
            optional_fields = [
                'website_url', 'description'
            ]
            
            # Check for missing mandatory fields
            missing_fields = [field for field in mandatory_fields if field not in data]
            if missing_fields:
                return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)
            
            # Check if user already exists
            if User.objects.filter(username=data['username']).exists():
                return JsonResponse({'error': 'A user with this username already exists'}, status=400)
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'A user with this email already exists'}, status=400)

            # Create User and EmployerProfile
            user = User.objects.create_user(
                username=data['username'],
                password=data['password'],
                email=data['email'],
                role='Employer'
            )
            user.save()

            employer_profile = EmployerProfile(
                user=user,
                company_name=data['company_name'],
                industry=data['industry'],
                contact_phone=data['contact_phone'],
                location=data['location'],
                website_url=data.get('website_url', ''),
                description=data.get('description', '')
            )
            employer_profile.save()

            file_path = os.path.join(settings.MEDIA_ROOT, 'logos', f'{user.id}_{employer_profile.id}')
            print("File path: ", file_path)
            if logo:
                print("Logo detected")
                
                # Ensure the directory exists
                if not os.path.exists(file_path):
                    os.makedirs(file_path)
                fs = FileSystemStorage(location=file_path)
                filename = fs.save(logo.name, logo)
                employer_profile.logo = os.path.join('logos', f'{user.id}_{employer_profile.id}', filename)
                employer_profile.save()

                # Debugging: Print the final full path of the logo
                final_logo_path = os.path.join(settings.MEDIA_ROOT, str(employer_profile.logo))  # Convert to string
                print("Final logo path: ", final_logo_path)

            # Trigger the create_employer signal
            create_employer.send(sender=register_employer, employer_profile=employer_profile, logo_path=employer_profile.logo.url)

            return JsonResponse({'message': 'Employer registration successful', 'data': data})
        except Exception as e:
            print("Exception occurred:", str(e))
            print(traceback.format_exc())  # Print the full traceback for debugging
            return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)

@csrf_exempt
def register_hiring_coordinator(request):
    if request.method == 'POST':
        try:
            data = request.POST.dict()

            # Define mandatory fields
            mandatory_fields = [
                'username', 'password', 'email', 'role', 'full_name'
            ]

            # Check for missing mandatory fields
            missing_fields = [field for field in mandatory_fields if field not in data]
            if missing_fields:
                return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)

            # Check if user already exists
            if User.objects.filter(username=data['username']).exists():
                return JsonResponse({'error': 'A user with this username already exists'}, status=400)
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'A user with this email already exists'}, status=400)

            # Create User and HiringCoordinatorProfile
            user = User.objects.create_user(
                username=data['username'],
                password=data['password'],
                email=data['email'],
                role='Hiring Coordinator'
            )
            user.save()

            hiring_coordinator_profile = HiringCoordinatorProfile(
                user=user,
                full_name=data['full_name']
            )
            hiring_coordinator_profile.save()

            return JsonResponse({'message': 'Hiring Coordinator registration successful', 'data': data})
        except Exception as e:
            print("Exception occurred:", str(e))
            print(traceback.format_exc())  # Print the full traceback for debugging
            return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)

@csrf_exempt
def register_case_worker(request):
    if request.method == 'POST':
        try:
            data = request.POST.dict()
            
            # Define mandatory fields
            mandatory_fields = ['username', 'password', 'email', 'role', 'full_name']
            
            # Check for missing mandatory fields
            missing_fields = [field for field in mandatory_fields if field not in data]
            if missing_fields:
                return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)
            
            # Check if user already exists
            if User.objects.filter(username=data['username']).exists():
                return JsonResponse({'error': 'A user with this username already exists'}, status=400)
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'A user with this email already exists'}, status=400)
            
            # Create User
            user = User.objects.create_user(
                username=data['username'],
                password=data['password'],
                email=data['email'],
                role=data['role']
            )
            
            # Create CaseWorkerProfile
            CaseWorkerProfile.objects.create(
                user=user,
                full_name=data['full_name']
            )
            
            return JsonResponse({'message': 'Case Worker registration successful', 'data': data})
        except Exception as e:
            print("Exception occurred:", str(e))
            print(traceback.format_exc())  # Print the full traceback for debugging
            return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)
