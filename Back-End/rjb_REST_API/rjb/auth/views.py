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
        # Fetch full name based on user role
        if role == 'Candidate':
            print("User is a candidate")
            full_name = CandidateProfile.objects.get(user=user).full_name
        elif role == 'Employer':
            print("User is an employer")
            company_name = EmployerProfile.objects.get(user=user).company_name
        elif role == 'Hiring Coordinator':
            print("User is a hiring coordinator")
            full_name = HiringCoordinatorProfile.objects.get(user=user).full_name
        elif role == 'Case Worker':
            print("User is a case worker")
            full_name = CaseWorkerProfile.objects.get(user=user).full_name

        response_data = {
            "message": "Login successful",
            "status": "success",
            "username": user.username,
            "email": user.email,
            "role": role,
            "full_name": full_name,
            "company_name": company_name
        }

        print("response_data: ", response_data)

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

@csrf_exempt
def register_candidate(request):
    if request.method == 'POST':
        try:
            data = request.POST.dict()
            profile_picture = request.FILES.get('profile_picture')

            print("profile_picture: ", profile_picture)

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
            
            # Check and print mandatory fields
            print("Mandatory Fields:")
            for field in mandatory_fields:
                if field in data:
                    print(f"{field}: {data[field]}")
                else:
                    print(f"{field}: MISSING")
            
            # Check and print optional fields
            print("\nOptional Fields:")
            for field in optional_fields:
                if field in data:
                    print(f"{field}: {data[field]}")
                else:
                    print(f"{field}: Not provided")
            
            if profile_picture:
                print("profile picture detected")
                print(f"profile_picture: {profile_picture}")
            else:
                print("no profile picture detected")

            

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
                immigration_status=data.get('immigration_status')
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
                        start_year=qualification['startYear'],  # Fix KeyError
                        end_year=qualification['endYear'],  # Fix KeyError
                        candidate=candidate_profile
                    )
            
            # Handle work experiences
            if 'workExperiences' in data:
                work_experiences = json.loads(data['workExperiences'])
                for work_experience in work_experiences:
                    work_exp = WorkExperience.objects.create(
                        company=work_experience['company'],
                        role=work_experience['role'],
                        start_year=work_experience['startYear'],  # Fix KeyError
                        end_year=work_experience['endYear'],  # Fix KeyError
                        description=work_experience.get('description'),
                        candidate=candidate_profile
                    )
                    if 'skills' in work_experience:
                        work_exp_skills = work_experience['skills']
                        for skill_name in work_exp_skills:
                            skill, created = Skill.objects.get_or_create(skill_name=skill_name.strip())
                            work_exp.skills.add(skill)
            
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

            # Check if user already exists
            if User.objects.filter(username=data['username']).exists():
                return JsonResponse({'error': 'A user with this username already exists'}, status=400)
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'A user with this email already exists'}, status=400)

            # Define mandatory and optional fields
            mandatory_fields = [
                'username', 'password', 'email', 'role', 'company_name', 
                'contact_phone', 'location', 'logo', 'industry'
            ]
            optional_fields = [
                'website_url', 'description'
            ]
            
            # Check and print mandatory fields
            print("Mandatory Fields:")
            for field in mandatory_fields:
                if field in data:
                    print(f"{field}: {data[field]}")
                else:
                    print(f"{field}: MISSING")
            
            # Check and print optional fields
            print("\nOptional Fields:")
            for field in optional_fields:
                if field in data:
                    print(f"{field}: {data[field]}")
                else:
                    print(f"{field}: Not provided")
            
            if logo:
                print(f"logo: {logo.name}")
            
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
            mandatory_fields = ['username', 'password', 'email', 'role', 'full_name']
            
            # Check and print mandatory fields
            print("Mandatory Fields:")
            for field in mandatory_fields:
                if field in data:
                    print(f"{field}: {data[field]}")
                else:
                    print(f"{field}: MISSING")
            
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
            
            # Create HiringCoordinatorProfile
            HiringCoordinatorProfile.objects.create(
                user=user,
                full_name=data['full_name']
            )
            
            return JsonResponse({'message': 'Hiring Coordinator registration successful', 'data': data})
        except Exception as e:
            return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)

@csrf_exempt
def register_case_worker(request):
    if request.method == 'POST':
        try:
            data = request.POST.dict()
            
            # Define mandatory fields
            mandatory_fields = ['username', 'password', 'email', 'role', 'full_name']
            
            # Check and print mandatory fields
            print("Mandatory Fields:")
            for field in mandatory_fields:
                if field in data:
                    print(f"{field}: {data[field]}")
                else:
                    print(f"{field}: MISSING")
            
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
            return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)