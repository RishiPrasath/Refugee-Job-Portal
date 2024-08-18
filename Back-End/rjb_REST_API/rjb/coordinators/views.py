from rest_framework.decorators import api_view
from rest_framework.response import Response
from rjb.models import CandidateProfile, User, Event, EmployerProfile, JobPosting, Application, Interview, JobOffer  # Import EmployerProfile, JobPosting, Application, Interview, and JobOffer
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rjb.models import *
from rjb.models import Application

@api_view(['GET'])
def employer_view(request, employer_id):
    try:
        # Retrieve the EmployerProfile object by ID
        employer_profile = get_object_or_404(EmployerProfile, id=employer_id)
        user = employer_profile.user  # Get the associated user
        
        employer_data = {
            'company_name': employer_profile.company_name,
            'industry': employer_profile.industry,
            'location': employer_profile.location,
            'description': employer_profile.description,
            'logo_url': request.build_absolute_uri(employer_profile.logo.url) if employer_profile.logo else None,
            'email': user.email,
            'contact_phone': employer_profile.contact_phone,
            'website_url': employer_profile.website_url,
        }

        # Retrieve the job postings related to the employer
        job_postings = JobPosting.objects.filter(employer=employer_profile)

        # Format the job postings data
        employer_data['job_postings'] = [
            {
                'id': job_posting.id,
                'job_title': job_posting.job_title,
                'job_description': job_posting.job_description,
                'location': job_posting.location,
                'compensation_amount': job_posting.compensation_amount,
                'compensation_type': job_posting.compensation_type,
                'job_type': job_posting.job_type,
                'employment_term': job_posting.employment_term,
                'status': job_posting.status,
                'ISL': job_posting.ISL,
                'skills': [skill.skill_name for skill in job_posting.skills.all()],
            } for job_posting in job_postings
        ]


        # Retrieve the interviews related to the employer
        interviews = Interview.objects.filter(application__job__employer=employer_profile)

        # Format the interview data
        employer_data['interviews'] = [
            {
                'id': interview.id,
                'interview_type': interview.interview_type,
                'date': interview.date,
                'start_time': interview.start_time,
                'end_time': interview.end_time,
                'interview_location': interview.interview_location,
                'meeting_link': interview.meeting_link,
                'additional_details': interview.additional_details,
                'status': interview.status,
                'feedback': interview.feedback,
                'job_title': interview.application.job.job_title,
                'candidate_full_name': interview.application.applicant.candidateprofile.full_name,
                'candidate_phone': interview.application.applicant.candidateprofile.contact_phone,
                'candidate_email': interview.application.applicant.email,
                'candidate_profile_pic': request.build_absolute_uri(interview.application.applicant.candidateprofile.profile_picture.url) if interview.application.applicant.candidateprofile.profile_picture else None,
            } for interview in interviews
        ]

        events = Event.objects.filter(owner=user)

        employer_data['events'] = [
            {
                'description': event.description,
                'created_at': event.created_at,
            } for event in events
        ]




        # Return the employer data
        return Response(employer_data, status=200)

    except EmployerProfile.DoesNotExist:
        return Response({'error': 'Employer profile does not exist'}, status=404)
    except Exception as e:
        print(f"Error accessing employer_view: {e}")
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def candidate_view(request, candidate_id):
    try:
        # Retrieve the CandidateProfile object by ID
        candidate_profile = get_object_or_404(CandidateProfile, id=candidate_id)
        user = candidate_profile.user  # Get the associated user

        print("Candidate data")
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

        #qualification data

        qualifications = Qualification.objects.filter(candidate=candidate_profile)
        candidate_data['qualifications'] = [
            {
                'school': qualification.school,
                'qualification': qualification.qualification,
                'start_year': qualification.start_year,
                'end_year': qualification.end_year,
            } for qualification in qualifications
        ]

        work_experiences = WorkExperience.objects.filter(candidate=candidate_profile)
        candidate_data['work_experiences'] = [
            {
                'job_title': work_experience.role,
                'employer': work_experience.company,
                'start_date': work_experience.start_year,
                'end_date': work_experience.end_year,
                'description': work_experience.description,
            } for work_experience in work_experiences
        ]



        
        # Get events related to the candidate's user
        events = Event.objects.filter(owner=user)  # Filter events by the candidate's user
        candidate_data['events'] = [
            {
                'description': event.description,
                'created_at': event.created_at,
            } for event in events
        ]
        print("Event data")


        #get applications from candidate profile
        applications = Application.objects.filter(applicant=user)
        candidate_data['applications'] = [
            {
                'id': application.id,
                'job_title': application.job.job_title,
                'employer': application.job.employer.company_name,
                'employer_logo_url': request.build_absolute_uri(application.job.employer.logo.url) if application.job.employer.logo else None,
                'application_status': application.status,
                'cover_letter': application.cover_letter,
                'cv_url': request.build_absolute_uri(application.cv.url) if application.cv else None,
                'created_at': application.created_at.isoformat(),
            } for application in applications
        ]
        print("Application data")

        #get interviews from each application
        interviews = Interview.objects.filter(application__applicant=user)
        candidate_data['interviews'] = [
            {
                'id': interview.id,
                'application_id': interview.application.id,
                'date': interview.date.isoformat(),
                'start_time': interview.start_time.isoformat(),
                'end_time': interview.end_time.isoformat(),
                'interview_location': interview.interview_location,
                'meeting_link': interview.meeting_link,
                'additional_details': interview.additional_details,
                'status': interview.status,
                'feedback': interview.feedback,
                'job_title': interview.application.job.job_title,
                'employer': interview.application.job.employer.company_name,
                'interview_type': interview.interview_type,
                'logo_url': request.build_absolute_uri(interview.application.job.employer.logo.url) if interview.application.job.employer.logo else None,
            } for interview in interviews
        ]
        print("Interview data")


        #job offers
        job_offers = JobOffer.objects.filter(candidate=candidate_profile)
        candidate_data['job_offers'] = [
            {
                'job_title': job_offer.job_posting.job_title,
                'employer': job_offer.employer.company_name,
                'offer_date': job_offer.offer_datetime,
                'status': job_offer.status,
                'additional_details': job_offer.additional_details,
                'job_offer_document': request.build_absolute_uri(job_offer.job_offer_document.url) if job_offer.job_offer_document else None
            }
            for job_offer in job_offers
        ]
        print("Job offer data")




        # Return the candidate data
        return Response(candidate_data, status=200)

    except CandidateProfile.DoesNotExist:
        return Response({'error': 'Candidate profile does not exist'}, status=404)
    except Exception as e:
        print(f"Error accessing candidate_view: {e}")
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def home(request):
    data = {
        "message": "Welcome to the Coordinator Portal",
        "status": "success"
    }
    return Response(data)


@api_view(['GET'])
def search(request):
    query = request.GET.get('q', '')
    if not query:
        return Response({'error': 'Search query is required'}, status=400)

    # Search in CandidateProfile
    candidates = CandidateProfile.objects.filter(
        Q(full_name__icontains=query) | Q(user__email__icontains=query) | Q(skills__skill_name__icontains=query)
    ).distinct()  

    # Search in JobPosting
    job_postings = JobPosting.objects.filter(
        Q(job_title__icontains=query) | Q(job_description__icontains=query) | Q(skills__skill_name__icontains=query)
    ).distinct()  

    # Search in EmployerProfile
    employers = EmployerProfile.objects.filter(
        Q(company_name__icontains=query) | Q(industry__icontains=query)
    ).distinct()

    unique_ids = set()

    results = {
        'candidates': [
            {
                'id': c.id,
                'image': request.build_absolute_uri(c.profile_picture.url) if c.profile_picture else None,
                'full_name': c.full_name,
                'email': c.user.email,
                'immigration_status': c.immigration_status,
                'skills': [skill.skill_name for skill in c.skills.all()],
                'type': 'candidate',
                'routetopage': f'/candidate-view/{c.id}'  # Add routing for candidate
            } for c in candidates if c.id not in unique_ids and not unique_ids.add(c.id)
        ],
        'job_postings': [
            {
                'id': j.id,
                'image': request.build_absolute_uri(j.employer.logo.url) if j.employer.logo else None,
                'job_title': j.job_title,
                'company': j.employer.company_name,
                'location': j.location,  # Add location
                'compensation_amount': j.compensation_amount,  # Add compensation amount
                'compensation_type': j.compensation_type,  # Add compensation type
                'job_type': j.job_type,  # Add job type
                'employment_term': j.employment_term,  # Add employment term
                'ISL': j.ISL,  # Add ISL
                'type': 'job_posting',
                'skills': [skill.skill_name for skill in j.skills.all()],
                'routetopage': f'/jobposting-view/{j.id}'  # Add routing for job posting
            } for j in job_postings if j.id not in unique_ids and not unique_ids.add(j.id)
        ],
        'employers': [
            {
                'id': e.id,
                'image': request.build_absolute_uri(e.logo.url) if e.logo else None,
                'company_name': e.company_name,
                'industry': e.industry,
                'location': e.location,
                'type': 'employer',
                'routetopage': f'/employer-view/{e.id}' ,
                'description': e.description
            } for e in employers if e.id not in unique_ids and not unique_ids.add(e.id)
        ]
    }


    print('Results: ', results)

    return Response(results, status=200)

@api_view(['GET'])
def job_posting_view(request, job_id):
    try:
        # Retrieve the JobPosting object by ID
        job_posting = get_object_or_404(JobPosting, id=job_id)
        
        job_posting_data = {
            'id': job_posting.id,
            'job_title': job_posting.job_title,
            'job_description': job_posting.job_description,
            'location': job_posting.location,
            'compensation_amount': job_posting.compensation_amount,
            'compensation_type': job_posting.compensation_type,
            'job_type': job_posting.job_type,
            'employment_term': job_posting.employment_term,
            'status': job_posting.status,
            'ISL': job_posting.ISL,
            'skills': [skill.skill_name for skill in job_posting.skills.all()],
            'requirements': job_posting.requirements,
            'employer': {
                'company_name': job_posting.employer.company_name,
                'logo_url': request.build_absolute_uri(job_posting.employer.logo.url) if job_posting.employer.logo else None,
            }
        }

        # Retrieve the list of applicants related to the job posting
        applicants = Application.objects.filter(job=job_posting)
        
        # Prepare the applicant data
        applicant_data = [
            {
                'id': applicant.id,
                'full_name': applicant.applicant.candidateprofile.full_name,
                'email': applicant.applicant.email,
                'skills': [skill.skill_name for skill in applicant.applicant.candidateprofile.skills.all()],
                'phone_number': applicant.applicant.candidateprofile.contact_phone,
                'profile_picture': request.build_absolute_uri(applicant.applicant.candidateprofile.profile_picture.url) if applicant.applicant.candidateprofile.profile_picture else None,
                'status': applicant.status,
            }
            for applicant in applicants
        ]
        
        # Add the applicant data to the job posting data
        job_posting_data['applicants'] = applicant_data



        # Return the job posting data
        return Response(job_posting_data, status=200)

    except JobPosting.DoesNotExist:
        return Response({'error': 'Job posting does not exist'}, status=404)
    except Exception as e:
        print(f"Error accessing job_posting_view: {e}")
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def job_application_view(request, application_id):
    try:
        application = get_object_or_404(Application, id=application_id)
        candidate = application.applicant.candidateprofile
        
        # Candidate Profile
        candidate_profile = {
            'full_name': candidate.full_name,
            'email': application.applicant.email,
            'phone_number': candidate.contact_phone,
            'profile_picture': request.build_absolute_uri(candidate.profile_picture.url) if candidate.profile_picture else None,
            'linkedin_profile': candidate.linkedin_profile,
            'github_profile': candidate.github_profile,
            'skills': list(candidate.skills.values_list('skill_name', flat=True)),
        }
        
        # Application
        application_data = {
            'id': application.id,
            'job_title': application.job.job_title,
            'employer': application.job.employer.company_name,
            'application_status': application.status,
            'cover_letter': application.cover_letter,
            'cv_url': request.build_absolute_uri(application.cv.url) if application.cv else None,
            'created_at': application.created_at.isoformat(),
        }
        
        # Interviews
        interviews = Interview.objects.filter(application=application)
        interview_data = [{
            'id': interview.id,
            'interview_type': interview.interview_type,
            'date': interview.date.isoformat(),
            'start_time': interview.start_time.isoformat(),
            'end_time': interview.end_time.isoformat(),
            'interview_location': interview.interview_location,
            'meeting_link': interview.meeting_link,
            'additional_details': interview.additional_details,
            'status': interview.status,
            'feedback': interview.feedback,
        } for interview in interviews]
        
        # Job Offer
        job_offer = JobOffer.objects.filter(application=application).first()
        job_offer_data = None
        if job_offer:
            job_offer_data = {
                'job_offer_document': request.build_absolute_uri(job_offer.job_offer_document.url) if job_offer.job_offer_document else None,
                'additional_details': job_offer.additional_details,
                'offer_datetime': job_offer.offer_datetime.isoformat(),
                'status': job_offer.status,
            }
        
        response_data = {
            'candidateProfile': candidate_profile,
            'application': application_data,
            'interviews': interview_data,
            'jobOffer': job_offer_data,
        }


        
        
        return Response(response_data, status=200)

    except Application.DoesNotExist:
        return Response({'error': 'Application does not exist'}, status=404)
    except Exception as e:
        print(f"Error accessing job_application_view: {e}")
        return Response({'error': str(e)}, status=500)