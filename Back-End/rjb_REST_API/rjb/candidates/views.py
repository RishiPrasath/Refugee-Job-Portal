from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.db.models import Q
from rjb.models import *
import base64
import os
from django.conf import settings
from django.utils import timezone
from datetime import datetime, time
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

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
            'job_id': job.id,
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
        
        # Get caseworker details
        caseworker_data = None
        if candidate_profile.case_worker:
            caseworker_data = {
                'full_name': candidate_profile.case_worker.full_name,
                'email': candidate_profile.case_worker.user.email,
            }
        
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
            'caseworker': caseworker_data,  # Add caseworker details
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

@api_view(['POST'])
def submitJobApplication(request):
    job_title = request.data.get('job_title')
    company_name = request.data.get('company_name')
    job_id = request.data.get('job_id')
    username = request.data.get('username')
    email = request.data.get('email')
    cover_letter = request.data.get('cover_letter')
    resume = request.FILES.get('resume')

    print("===============================")
    print("job_title: ", job_title)
    print("company_name: ", company_name)
    print("job_id: ", job_id)
    print("username: ", username)
    print("email: ", email)
    print("cover_letter: ", cover_letter)
    print("resume: ", resume)
    print("===============================")

    try:
        user = User.objects.get(username=username, email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)
        employer_profile = EmployerProfile.objects.get(company_name=company_name)
        job_posting = JobPosting.objects.get(id=job_id, job_title=job_title, employer=employer_profile)

        # Save the resume file if provided
        resume_path = None
        if resume:
            resume_directory = os.path.join(settings.MEDIA_ROOT, 'jobApplicationResumes', f'{employer_profile.user.id}_{employer_profile.id}', f'{candidate_profile.user.id}_{candidate_profile.id}', f'{job_posting.id}')
            os.makedirs(resume_directory, exist_ok=True)
            resume_path = os.path.join(resume_directory, resume.name)
            with open(resume_path, 'wb+') as destination:
                for chunk in resume.chunks():
                    destination.write(chunk)

        # Create the application
        application = Application.objects.create(
            job=job_posting,
            applicant=user,
            cover_letter=cover_letter,
            cv=resume_path,
            status='Submitted'
        )

        return JsonResponse({'message': 'Application submitted successfully.'}, status=201)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)
    except EmployerProfile.DoesNotExist:
        return JsonResponse({'error': 'Employer not found'}, status=404)
    except JobPosting.DoesNotExist:
        return JsonResponse({'error': 'Job posting not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def getAppliedJobs(request):
    email = request.GET.get('email')
    username = request.GET.get('username')

    try:
        user = User.objects.get(username=username, email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)
        applications = Application.objects.filter(applicant=user)

        applied_jobs = [
            {
                'id': application.job.id,
                'job_title': application.job.job_title,
                'company_name': application.job.employer.company_name if application.job.employer else '',
                'status': application.status,
                'date_time_applied': application.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for application in applications
        ]

        return JsonResponse(applied_jobs, safe=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)

@api_view(['POST'])
def withdrawApplication(request):
    job_title = request.data.get('job_title')
    company_name = request.data.get('company_name')
    job_id = request.data.get('job_id')
    username = request.data.get('username')
    email = request.data.get('email')


    print("===============================")
    print("job_title: ", job_title)
    print("company_name: ", company_name)
    print("job_id: ", job_id)
    print("username: ", username)
    print("email: ", email)
    print("===============================")

    try:
        user = User.objects.get(username=username, email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)
        employer_profile = EmployerProfile.objects.get(company_name=company_name)
        job_posting = JobPosting.objects.get(id=job_id, employer=employer_profile, job_title=job_title)

        # Remove the application
        application = Application.objects.get(job=job_posting, applicant=user)
        application.delete()

        return JsonResponse({'message': 'Application withdrawn successfully'}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)
    except EmployerProfile.DoesNotExist:
        return JsonResponse({'error': 'Employer not found'}, status=404)
    except JobPosting.DoesNotExist:
        return JsonResponse({'error': 'Job posting not found'}, status=404)
    except Application.DoesNotExist:
        return JsonResponse({'error': 'Application not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
def getCandidateUpcomingInterviews(request):
    email = request.GET.get('email')
    username = request.GET.get('username')

    print("===============================")
    print("email: ", email)
    print("username: ", username)
    print("===============================")

    try:
        user = User.objects.get(username=username, email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)
        applications = Application.objects.filter(applicant=user)

        # Get current date and time
        now = timezone.now()
        today = now.date()

        # Filter interviews
        interviews = Interview.objects.filter(
            application__in=applications,
            status__in=['Scheduled', 'Rescheduled', 'Cancelled']  # Filter by status
        ).filter(
            # Interview date is today or in the future
            date__gte=today
        ).exclude(
            # Exclude interviews from today that have already ended
            date=today,
            end_time__lt=now.time()
        ).select_related('application__job__employer')  # Optimize query

        interview_data = []
        for interview in interviews:
            employer = interview.application.job.employer
            company_name = employer.company_name
            company_email = employer.user.email
            company_logo = None

            if employer.logo:
                with open(employer.logo.path, "rb") as logo_file:
                    company_logo = base64.b64encode(logo_file.read()).decode('utf-8')

            interview_data.append({
                'id': interview.id,
                'interview_type': interview.interview_type,
                'date': interview.date.isoformat(),
                'start_time': interview.start_time.isoformat(),
                'end_time': interview.end_time.isoformat(),
                'interview_location': interview.interview_location,
                'meeting_link': interview.meeting_link,
                'additional_details': interview.additional_details,
                'status': interview.status,
                'job_title': interview.application.job.job_title,
                'company_name': company_name,
                'company_email': company_email,
                'company_logo': company_logo,
            })

        return JsonResponse(interview_data, safe=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)


@api_view(['GET'])
def getCandidateJobOffers(request):
    username = request.GET.get('username')
    email = request.GET.get('email')

    print("===============================")
    print("username: ", username)
    print("email: ", email)
    print("===============================")

    try:
        user = User.objects.get(username=username, email=email)
        candidate = CandidateProfile.objects.get(user=user)
        job_offers = JobOffer.objects.filter(candidate=candidate)

        job_offer_data = []
        for job_offer in job_offers:
            job_posting = job_offer.job_posting
            employer = job_posting.employer
            job_offer_info = {
                'id': job_offer.id,
                'job_title': job_posting.job_title,
                'company_name': employer.company_name,
                'location': job_posting.location,
                'employment_term': job_posting.employment_term,
                'compensation_amount': job_posting.compensation_amount,
                'compensation_type': job_posting.compensation_type,
                'company_logo': request.build_absolute_uri(employer.logo.url) if employer.logo else None,
                'offer_datetime': job_offer.offer_datetime.isoformat(),
                'additional_details': job_offer.additional_details,
                'job_offer_document': request.build_absolute_uri(job_offer.job_offer_document.url) if job_offer.job_offer_document else None,
                'status': job_offer.status
            }
            job_offer_data.append(job_offer_info)

        return JsonResponse(job_offer_data, safe=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@api_view(['POST'])
def approveJobOffer(request, job_offer_id):
    try:
        job_offer = JobOffer.objects.get(id=job_offer_id)
        job_offer.status = 'Approved'
        job_offer.save()
        return JsonResponse({'message': 'Job offer approved successfully'}, status=200)
    except JobOffer.DoesNotExist:
        return JsonResponse({'error': 'Job offer not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
def rejectJobOffer(request, job_offer_id):
    try:
        job_offer = JobOffer.objects.get(id=job_offer_id)
        job_offer.status = 'Rejected'
        job_offer.save()
        return JsonResponse({'message': 'Job offer rejected successfully'}, status=200)
    except JobOffer.DoesNotExist:
        return JsonResponse({'error': 'Job offer not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
def getCandidateApplications(request):
    username = request.GET.get('username')
    email = request.GET.get('email')

    try:
        user = User.objects.get(username=username, email=email)
        candidate_profile = CandidateProfile.objects.get(user=user)

        # Fetch all related applications
        applications = Application.objects.filter(applicant=user)
        approved_applications = []
        rejected_applications = []
        under_review_applications = []

        for application in applications:
            application_data = {
                "job_title": application.job.job_title,
                "company": application.job.employer.company_name,
                "logo": base64.b64encode(application.job.employer.logo.read()).decode('utf-8') if application.job.employer.logo else None,
                "status": application.status,
                "employment_term": application.job.employment_term,
                "created_at": application.created_at,
            }
            if application.status == 'Approved':
                approved_applications.append(application_data)
            elif application.status == 'Rejected':
                rejected_applications.append(application_data)
            else:
                under_review_applications.append(application_data)

        return JsonResponse({
            "message": "Success",
            "approved_applications": approved_applications,
            "rejected_applications": rejected_applications,
            "under_review_applications": under_review_applications
        }, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return JsonResponse({'error': 'Candidate profile not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)