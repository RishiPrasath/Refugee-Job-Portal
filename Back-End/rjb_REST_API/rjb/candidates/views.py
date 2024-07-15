from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.db.models import Q
from rjb.models import JobPosting, EmployerProfile , CandidateProfile, User, CandidateSavesJobPosting
import base64

@api_view(['GET'])
def home(request):
    data = {
        "message": "Welcome to the Candidate Portal",
        "status": "success"
    }
    return Response(data)

@require_GET
def searchJobPostings(request):
    query = request.GET.get('q', '')
    immigration_status = request.GET.get('immigration_status', '')

    print("query: ", query)
    print("immigration_status: ", immigration_status)


    filters = Q(job_title__icontains=query) | Q(job_description__icontains=query) | Q(requirements__icontains=query) | Q(location__icontains=query) | Q(compensation_amount__icontains=query) | Q(compensation_type__icontains=query) | Q(job_type__icontains=query) | Q(employment_term__icontains=query) | Q(employer__company_name__icontains=query) | Q(employer__industry__icontains=query) | Q(skills__skill_name__icontains=query)

    if immigration_status == 'Asylum Seeker':


        filters &= Q(ISL=True) #Important!

    if query:
        job_postings = JobPosting.objects.filter(filters).distinct()
    else:
        job_postings = JobPosting.objects.none()

    results = [
        {
            'id': job.id,
            'title': job.job_title,
            'company': job.employer.company_name if job.employer else '',
            'location': job.location,
            'immigrationSalaryList': job.ISL,
        }
        for job in job_postings
    ]
    return JsonResponse(results, safe=False)

@require_GET
def viewJobDetails(request, company, job_id):
    try:
        employer = EmployerProfile.objects.get(company_name=company)
        job = JobPosting.objects.get(id=job_id, employer=employer)
        job_details = {
            'company_name': employer.company_name,
            'job_title': job.job_title,
            'job_description': job.job_description,
            'requirements': job.requirements,
            'location': job.location,
            'compensation_amount': job.compensation_amount,
            'compensation_type': job.compensation_type,
            'job_type': job.job_type,
            'employment_term': job.employment_term,
            'status': job.status,
            'ISL': job.ISL,
            'skills': [skill.skill_name for skill in job.skills.all()],
        }
        return JsonResponse({'job_details': job_details})
    except EmployerProfile.DoesNotExist:
        return JsonResponse({'error': 'Employer not found'}, status=404)
    except JobPosting.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)
    


@api_view(['GET'])
def getCandidateProfile(request):
    email = request.GET.get('email')
    username = request.GET.get('username')

    try:
        user = User.objects.get(username=username, email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)
        
        # Encode the profile picture in base64
        profile_picture_base64 = None
        if candidate_profile.profile_picture:
            with open(candidate_profile.profile_picture.path, "rb") as image_file:
                profile_picture_base64 = base64.b64encode(image_file.read()).decode('utf-8')
        
        profile_data = {
            'full_name': candidate_profile.full_name,
            'email': user.email,
            'immigration_status': candidate_profile.immigration_status,
            'accessibility_requirements': candidate_profile.accessibility_requirements,
            'contact_phone': candidate_profile.contact_phone,
            'date_of_birth': candidate_profile.date_of_birth,
            'emergency_contact_name': candidate_profile.emergency_contact_name,
            'emergency_contact_phone': candidate_profile.emergency_contact_phone,
            'linkedin_profile': candidate_profile.linkedin_profile,
            'github_profile': candidate_profile.github_profile,
            'summary': candidate_profile.summary,
            'skills': [{'id': skill.id, 'skill_name': skill.skill_name, 'description': skill.description} for skill in candidate_profile.skills.all()],
            'qualifications': [{'id': qualification.id, 'school': qualification.school, 'qualification': qualification.qualification, 'start_year': qualification.start_year, 'end_year': qualification.end_year} for qualification in candidate_profile.qualification_set.all()],
            'workExperiences': [{'id': experience.id, 'company': experience.company, 'role': experience.role, 'start_year': experience.start_year, 'end_year': experience.end_year, 'description': experience.description} for experience in candidate_profile.workexperience_set.all()],
            'profile_picture': profile_picture_base64,
        }
        
        return JsonResponse(profile_data)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)

@api_view(['POST'])
def saveJob(request):
    email = request.data.get('email')
    username = request.data.get('username')
    job_title = request.data.get('job_title')
    company_name = request.data.get('company_name')

    try:
        user = User.objects.get(username=username, email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)
        job_posting = JobPosting.objects.get(job_title=job_title, employer__company_name=company_name)

        # Create the relationship
        saved_job, created = CandidateSavesJobPosting.objects.get_or_create(candidate=candidate_profile, job_posting=job_posting)

        if created:
            return JsonResponse({'message': 'Job saved successfully'}, status=201)
        else:
            return JsonResponse({'message': 'Job already saved'}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)
    except JobPosting.DoesNotExist:
        return JsonResponse({'error': 'Job posting not found'}, status=404)

@api_view(['GET'])
def getSavedJobs(request):
    email = request.GET.get('email')
    username = request.GET.get('username')

    try:
        user = User.objects.get(username=username, email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)
        saved_jobs = CandidateSavesJobPosting.objects.filter(candidate=candidate_profile).select_related('job_posting')

        job_postings = [
            {
                'id': saved_job.job_posting.id,
                'title': saved_job.job_posting.job_title,
                'company': saved_job.job_posting.employer.company_name if saved_job.job_posting.employer else '',
                'location': saved_job.job_posting.location,
                'immigrationSalaryList': saved_job.job_posting.ISL,
            }
            for saved_job in saved_jobs
        ]

        return JsonResponse(job_postings, safe=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)

@api_view(['POST'])
def removeSavedJob(request):
    email = request.data.get('email')
    username = request.data.get('username')
    job_title = request.data.get('job_title')
    company_name = request.data.get('company_name')

    try:
        user = User.objects.get(username=username, email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)
        job_posting = JobPosting.objects.get(job_title=job_title, employer__company_name=company_name)

        # Remove the relationship
        saved_job = CandidateSavesJobPosting.objects.get(candidate=candidate_profile, job_posting=job_posting)
        saved_job.delete()

        return JsonResponse({'message': 'Job removed successfully'}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)
    except JobPosting.DoesNotExist:
        return JsonResponse({'error': 'Job posting not found'}, status=404)
    except CandidateSavesJobPosting.DoesNotExist:
        return JsonResponse({'error': 'Saved job not found'}, status=404)