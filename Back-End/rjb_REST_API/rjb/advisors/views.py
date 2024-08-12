from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rjb.models import CandidateProfile, Qualification, WorkExperience, JobOffer, Application, Interview
from django.http import JsonResponse

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
        
        response_data = {
            'candidate_profile': candidate_data,
            'qualifications': qualifications,
            'work_experiences': work_experiences,
            'job_offers': job_offers,
            'job_applications': job_applications,
            'interviews': interviews  # Add interviews to the response data
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