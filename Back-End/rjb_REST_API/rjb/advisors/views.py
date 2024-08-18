from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rjb.models import CandidateProfile, Qualification, WorkExperience, JobOffer, Application, Interview
from django.http import JsonResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
import json
import traceback
from rjb.models import *
from rjb.notifications.signals import create_candidate as create_candidate_signal
from django.db.models import Q
from rjb.models import CandidateProfile, JobPosting, EmployerProfile


User = get_user_model()

@api_view(['GET'])
def get_candidate_profile(request):
    email = request.GET.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=400)
    
    try:
        user = User.objects.get(email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)
        
        candidate_data = {
            'full_name': candidate_profile.full_name,
            'email': user.email,  # Ensure email is included
            'date_of_birth': candidate_profile.date_of_birth,
            'contact_phone': candidate_profile.contact_phone,
            'emergency_contact_name': candidate_profile.emergency_contact_name,
            'emergency_contact_phone': candidate_profile.emergency_contact_phone,
            'linkedin_profile': candidate_profile.linkedin_profile,
            'github_profile': candidate_profile.github_profile,
            'summary': candidate_profile.summary,
            'skills': [skill.skill_name for skill in candidate_profile.skills.all()],
            'accessibility_requirements': candidate_profile.accessibility_requirements,
            'immigration_status': candidate_profile.immigration_status,
            'profile_picture': request.build_absolute_uri(candidate_profile.profile_picture.url) if candidate_profile.profile_picture else None,
            'status': candidate_profile.status,
            'case_worker': candidate_profile.case_worker.user.username if candidate_profile.case_worker else None,
        }
        
        qualifications = [
            {
                'school': qualification.school,
                'qualification': qualification.qualification,
                'start_year': qualification.start_year,
                'end_year': qualification.end_year
            }
            for qualification in candidate_profile.qualification_set.all()
        ]
        
        work_experiences = [
            {
                'company': experience.company,
                'role': experience.role,
                'start_year': experience.start_year,
                'end_year': experience.end_year,
                'description': experience.description,
                'skills': [skill.skill_name for skill in experience.skills.all()]
            }
            for experience in candidate_profile.workexperience_set.all()
        ]
        
        job_offers = [
            {
                'job_title': job_offer.job_posting.job_title,
                'employer': job_offer.employer.company_name,
                'offer_date': job_offer.offer_datetime,
                'status': job_offer.status,
                'additional_details': job_offer.additional_details,
                'job_offer_document': request.build_absolute_uri(job_offer.job_offer_document.url) if job_offer.job_offer_document else None
            }
            for job_offer in candidate_profile.joboffer_set.all()
        ]
        
        job_applications = [
            {
                'logo_url': request.build_absolute_uri(application.job.employer.logo.url) if application.job.employer.logo else None,
                'job_title': application.job.job_title,
                'employer': application.job.employer.company_name,
                'employer_logo_url': request.build_absolute_uri(application.job.employer.logo.url) if application.job.employer.logo else None,
                'cover_letter': application.cover_letter,
                'cv_url': request.build_absolute_uri(application.cv.url) if application.cv else None,
                'created_at': application.created_at,
                'status': application.status
            }
            for application in Application.objects.filter(applicant=user)
        ]
        
        # Retrieve interviews related to the candidate
        interviews = [
            {
                'job_title': interview.application.job.job_title,
                'employer': interview.application.job.employer.company_name,
                'logo_url': request.build_absolute_uri(interview.application.job.employer.logo.url) if interview.application.job.employer.logo else None,
                'application_id': interview.application.id,
                'interview_type': interview.interview_type,
                'date': interview.date,
                'start_time': interview.start_time,
                'end_time': interview.end_time,
                'interview_location': interview.interview_location,
                'meeting_link': interview.meeting_link,
                'additional_details': interview.additional_details,
                'status': interview.status,
                'feedback': interview.feedback
            }
            for interview in Interview.objects.filter(application__applicant=user)
        ]
        
        # Print the list of interviews
        print("Interviews:", interviews)
        
        events = Event.objects.filter(owner=user)

        events_data = [
            {
                'description': event.description,
                'created_at': event.created_at
            }
            for event in events
        ]




        response_data = {
            'candidate_profile': candidate_data,
            'qualifications': qualifications,
            'work_experiences': work_experiences,
            'job_offers': job_offers,
            'job_applications': job_applications,
            'interviews': interviews,
            'events': events_data
        }
        
        return Response(response_data, status=200)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=404)
    except CandidateProfile.DoesNotExist:
        return Response({'error': 'Candidate profile does not exist'}, status=404)
    except Exception as e:
        print(f"Error accessing get_candidate_profile: {e}")
        return Response({'error': str(e)}, status=500)
    
@api_view(['GET'])
def get_assigned_candidates(request):
    username = request.GET.get('username')
    email = request.GET.get('email')

    if not username or not email:
        return JsonResponse({'error': 'Username and email are required'}, status=400)

    try:
        user = User.objects.get(username=username, email=email)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

    if hasattr(user, 'caseworkerprofile'):
        case_worker = user.caseworkerprofile
        candidates = CandidateProfile.objects.filter(case_worker=case_worker).prefetch_related('qualification_set', 'workexperience_set')
        candidates_data = [
            {
                'full_name': candidate.full_name,
                'email': candidate.user.email,
                'immigration_status': candidate.immigration_status,
                'accessibility_requirements': candidate.accessibility_requirements,
                'profile_picture': request.build_absolute_uri(candidate.profile_picture.url) if candidate.profile_picture else None,
                'qualifications': [
                    {
                        'school': qualification.school,
                        'qualification': qualification.qualification,
                        'start_year': qualification.start_year,
                        'end_year': qualification.end_year
                    }
                    for qualification in candidate.qualification_set.all()
                ],
                'workExperiences': [
                    {
                        'company': experience.company,
                        'role': experience.role,
                        'start_year': experience.start_year,
                        'end_year': experience.end_year,
                        'description': experience.description
                    }
                    for experience in candidate.workexperience_set.all()
                ]
            }
            for candidate in candidates
        ]
        return JsonResponse({'candidates': candidates_data})
    else:
        return JsonResponse({'error': 'User is not a case worker'}, status=400)
    
@csrf_exempt
@api_view(['POST'])
def create_candidate(request):
    try:
        data = request.POST.dict()
        profile_picture = request.FILES.get('profile_picture')

        print("Received data:", json.dumps(data, indent=2))

        # Retrieve username and email for both candidate and case worker
        username = data.get('username')
        email = data.get('email')
        case_worker_username = data.get('case_worker_username')
        case_worker_email = data.get('case_worker_email')

        print(f"Candidate: {username} ({email})")
        print(f"Case Worker: {case_worker_username} ({case_worker_email})")

        # Create the user object for the candidate
        user, created = User.objects.get_or_create(username=username, email=email)
        if created:
            user.set_password(data.get('password'))
            user.save()
            print(f"Created new user: {user}")
        else:
            print(f"User already exists: {user}")

        # Get the case worker profile
        try:
            case_worker = CaseWorkerProfile.objects.get(user__username=case_worker_username, user__email=case_worker_email)
            print(f"Found case worker: {case_worker}")
        except CaseWorkerProfile.DoesNotExist:
            print(f"Case worker not found for {case_worker_username} ({case_worker_email})")
            return JsonResponse({'error': 'Case worker not found'}, status=400)

        # Parse date_of_birth to ensure it's in the correct format
        date_of_birth = data.get('date_of_birth')
        if date_of_birth:
            date_of_birth = date_of_birth.strip('"')

        # Create CandidateProfile
        candidate_profile = CandidateProfile.objects.create(
            user=user,
            full_name=data['full_name'],
            date_of_birth=date_of_birth,
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
        print(f"Created candidate profile: {candidate_profile}")

        # Handle profile picture
        if profile_picture:
            file_path = os.path.join(settings.MEDIA_ROOT, 'profile_pictures', f'{user.id}_{candidate_profile.id}')
            if not os.path.exists(file_path):
                os.makedirs(file_path)
            fs = FileSystemStorage(location=file_path)
            filename = fs.save(profile_picture.name, profile_picture)
            candidate_profile.profile_picture = os.path.join('profile_pictures', f'{user.id}_{candidate_profile.id}', filename)
            candidate_profile.save()
            print(f"Saved profile picture: {candidate_profile.profile_picture}")

        # Handle skills
        if 'skills' in data:
            skills = data['skills'].split(',')
            for skill_name in skills:
                skill, created = Skill.objects.get_or_create(skill_name=skill_name.strip())
                candidate_profile.skills.add(skill)
            print(f"Added skills: {skills}")

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
            print(f"Added qualifications: {qualifications}")

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
            print(f"Added work experiences: {work_experiences}")

        # Trigger the create_candidate signal
        create_candidate_signal.send(
            sender=candidate_profile.__class__, 
            candidate_profile=candidate_profile, 
            profile_picture_url=request.build_absolute_uri(candidate_profile.profile_picture.url)
        )

        print("Candidate registration successful")
        return JsonResponse({'message': 'Candidate registration successful', 'data': data})
    except Exception as e:
        print("Exception occurred:", str(e))
        print(traceback.format_exc())  # Print the full traceback for debugging
        return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)


