from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rjb.models import EmployerProfile, JobPosting, Skill, JobRequiresSkill, Application, CandidateProfile, User, Qualification, WorkExperience, Interview
from django.db.models import Q
import base64
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import datetime, time

@api_view(['GET'])
def home(request):
    data = {
        "message": "Welcome to the Employer Portal",
        "status": "success"
    }
    return Response(data)

@api_view(['POST'])
def addJobPosting(request):
    try:
        data = request.data
        print("Received data:", data)  # Debug print to check what data is received

        # Validate the employer
        employer = EmployerProfile.objects.filter(
            Q(company_name=data['company_name']) & 
            Q(user__email=data['email'])
        ).first()
        if not employer:
            return Response({"message": "Employer not found or email does not match."}, status=404)

        # Create the job posting
        job_posting = JobPosting(
            employer=employer,
            job_title=data['jobTitle'],
            job_description=data['jobDescription'],
            requirements="|".join(data['requirements']),
            location=data['location'],
            compensation_amount=data['compensationAmount'],
            compensation_type=data['compensationType'],
            job_type=data['jobType'],
            employment_term=data['employmentTerm'],
            ISL=data['ISL'],
            status='Open'  # Assuming a default status of 'open'
        )
        job_posting.save()

        # Link skills using the JobRequiresSkill intermediate model
        for skill_name in data['skills']:
            skill, created = Skill.objects.get_or_create(skill_name=skill_name)
            JobRequiresSkill.objects.create(job=job_posting, skill=skill)

        return Response({"message": "Job posting added successfully", "data": data})

    except Exception as e:
        print("Error in addJobPosting:", str(e))
        return Response({"message": "An error occurred", "error": str(e)}, status=500)

@api_view(['GET'])
def getJobPostings(request):
    username = request.query_params.get('username')
    company_name = request.query_params.get('company_name')
    
    try:
        employer = EmployerProfile.objects.get(user__username=username, company_name=company_name)
        job_postings = JobPosting.objects.filter(employer=employer).values()
        
        # print job postings
        print("Job postings:", job_postings)
        
        return Response({"job_postings": list(job_postings)})
    except EmployerProfile.DoesNotExist:
        return Response({"error": "Employer not found"}, status=404)

@api_view(['GET'])
def getJobDetails(request, job_id, username):
    try:
        print("Job ID:", job_id)
        print("Username:", username)

        # Get job based on job_id and related employer
        employer = EmployerProfile.objects.get(user__username=username)
        job = JobPosting.objects.get(id=job_id, employer=employer)
        print("Employer:", employer.company_name)
        print("Job:", job.job_title)

        # Get all Applications related to Job posting object
        applications = Application.objects.filter(job=job).select_related('applicant', 'applicant__candidateprofile')

        # Return response with fields from job object and list of applications
        job_details = {
            "job_title": job.job_title,
            "job_description": job.job_description,
            "requirements": job.requirements,
            "location": job.location,
            "compensation_amount": job.compensation_amount,
            "compensation_type": job.compensation_type,
            "job_type": job.job_type,
            "employment_term": job.employment_term,
            "status": job.status,
            "ISL": job.ISL,
            "skills": list(job.skills.values_list('skill_name', flat=True)),
        }

        print("Job details:", job_details)

        application_details = []
        for application in applications:
            candidate_profile = application.applicant.candidateprofile
            profile_picture = None
            if candidate_profile.profile_picture:
                with open(candidate_profile.profile_picture.path, "rb") as image_file:
                    profile_picture = base64.b64encode(image_file.read()).decode('utf-8')
            application_details.append({
                "id": application.id,
                "full_name": candidate_profile.full_name,
                "email": application.applicant.email,
                "skills": list(candidate_profile.skills.values_list('skill_name', flat=True)),
                "phone_number": candidate_profile.contact_phone,
                "profile_picture": profile_picture,
                "status": application.status,
            })

        print("Application details:", application_details)

        response_data = {
            "job_details": job_details,
            "applications": application_details,
        }

        return Response(response_data)
    except EmployerProfile.DoesNotExist:
        return Response({"error": "Employer not found"}, status=404)
    except JobPosting.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)
    except Exception as e:
        print("Error in getJobDetails:", str(e))
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def getCandidateApplicationDetails(request, application_id):
    try:
        print("Application ID:", application_id)
        application = Application.objects.get(id=application_id)
        candidate_profile = application.applicant.candidateprofile


        #pritn file name of cv
        print("CV file name:", application.cv.name)

        profile_picture = None
        if candidate_profile.profile_picture:
            with open(candidate_profile.profile_picture.path, "rb") as image_file:
                profile_picture = base64.b64encode(image_file.read()).decode('utf-8')

        qualifications = list(Qualification.objects.filter(candidate=candidate_profile).values())
        work_experiences = list(WorkExperience.objects.filter(candidate=candidate_profile).values())

        candidate_details = {
            "full_name": candidate_profile.full_name,
            "email": application.applicant.email,
            "skills": list(candidate_profile.skills.values_list('skill_name', flat=True)),
            "phone_number": candidate_profile.contact_phone,
            "profile_picture": profile_picture,
            "status": application.status,
            "immigration_status": candidate_profile.imigration_status,
            "accessibility_requirements": candidate_profile.accessibility_requirements,
            "date_of_birth": candidate_profile.date_of_birth,
            "emergency_contact_name": candidate_profile.emergency_contact_name,
            "emergency_contact_phone": candidate_profile.emergency_contact_phone,
            "linkedin_profile": candidate_profile.linkedin_profile,
            "github_profile": candidate_profile.github_profile,
            "summary": candidate_profile.summary,
            "qualifications": qualifications,
            "workExperiences": work_experiences,
            "application": {
                "id": application.id,
                "cover_letter": application.cover_letter,
                "cv_url": request.build_absolute_uri(application.cv.url) if application.cv else None,
                "status": application.status,
                "created_at": application.created_at,
            }
        }

        print('cv_url:', candidate_details['application']['cv_url'])

        print("Returning response....")

        return Response(candidate_details)
    except Application.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)
    except CandidateProfile.DoesNotExist:
        return Response({"error": "Candidate profile not found"}, status=404)
    except Exception as e:
        print("Error in getCandidateApplicationDetails:", str(e))
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def createInterview(request):
    try:
        data = request.data
        print("Received data:", data)  # Debug print to check what data is received

        application_id = data.get('applicationId')
        if not application_id:
            return Response({"message": "Application ID is required"}, status=400)

        try:
            application = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return Response({"message": "Application not found"}, status=404)

        interview = Interview(
            application=application,
            interview_type=data.get('interviewType'),
            date=data.get('date'),
            start_time=data.get('startTime'),
            end_time=data.get('endTime'),
            interview_location=data.get('interviewLocation'),
            meeting_link=data.get('meetingLink'),
            additional_details=data.get('additionalDetails'),
            status=data.get('status')
        )
        interview.save()

        return Response({"message": "Interview created successfully", "interview": interview.id}, status=201)
    except Exception as e:
        print("Error in createInterview:", str(e))  # Debug print to check the error
        return Response({"message": "An error occurred", "error": str(e)}, status=500)

@api_view(['GET'])
def getUpcomingInterviews(request):
    email = request.query_params.get('email')
    company_name = request.query_params.get('company_name')

    try:
        employer = EmployerProfile.objects.get(user__email=email, company_name=company_name)
        job_postings = JobPosting.objects.filter(employer=employer)
        applications = Application.objects.filter(job__in=job_postings)
        
        now = timezone.now()
        today = now.date()

        interviews = Interview.objects.filter(
            application__in=applications,
            date__gte=today
        ).exclude(
            date=today,
            end_time__lt=now.time()
        ).select_related('application__job', 'application__applicant__candidateprofile')

        interview_list = []
        for interview in interviews:
            interview_data = {
                'id': interview.id,
                'application_id': interview.application.id,
                'interview_type': interview.interview_type,
                'date': interview.date.isoformat(),
                'start_time': interview.start_time.isoformat(),
                'end_time': interview.end_time.isoformat(),
                'interview_location': interview.interview_location,
                'meeting_link': interview.meeting_link,
                'additional_details': interview.additional_details,
                'status': interview.status,
                'feedback': interview.feedback,
                'job_title': interview.application.job.job_title,
                'candidate_full_name': interview.application.applicant.candidateprofile.full_name,
                'candidate_phone': interview.application.applicant.candidateprofile.contact_phone,
                'candidate_email': interview.application.applicant.email,
            }
            interview_list.append(interview_data)

        return Response({"interviews": interview_list}, status=200)
    except EmployerProfile.DoesNotExist:
        return Response({"error": "Employer not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def updateInterview(request):
    try:
        data = request.data
        print("Received data:", data)  # Debug print to check what data is received

        interview_id = data.get('id')
        if not interview_id:
            return Response({"message": "Interview ID is required"}, status=400)

        try:
            interview = Interview.objects.get(id=interview_id)
        except Interview.DoesNotExist:
            return Response({"message": "Interview not found"}, status=404)

        interview.interview_type = data.get('interview_type', interview.interview_type)
        interview.date = data.get('date', interview.date)
        interview.start_time = data.get('start_time', interview.start_time)
        interview.end_time = data.get('end_time', interview.end_time)
        interview.interview_location = data.get('interview_location', interview.interview_location)
        interview.meeting_link = data.get('meeting_link', interview.meeting_link)
        interview.additional_details = data.get('additional_details', interview.additional_details)
        interview.status = 'Rescheduled'
        interview.save()

        # Update the application status
        application_id = data.get('application_id')
        if application_id:
            try:
                application = Application.objects.get(id=application_id)
                application.status = 'Interview Rescheduled'
                application.save()
            except Application.DoesNotExist:
                return Response({"message": "Application not found"}, status=404)

        return Response({"message": "Interview updated successfully", "interview": interview.id}, status=200)
    except Exception as e:
        print("Error in updateInterview:", str(e))  # Debug print to check the error
        return Response({"message": "An error occurred", "error": str(e)}, status=500)

@api_view(['POST'])
def cancelInterview(request):
    try:
        data = request.data
        interview_id = data.get('id')
        if not interview_id:
            return Response({"message": "Interview ID is required"}, status=400)

        try:
            interview = Interview.objects.get(id=interview_id)
        except Interview.DoesNotExist:
            return Response({"message": "Interview not found"}, status=404)

        interview.status = 'Cancelled'
        interview.save()

        # Update the application status
        application = interview.application
        application.status = 'Interview Cancelled'
        application.save()

        return Response({"message": "Interview cancelled successfully", "interview": interview.id}, status=200)
    except Exception as e:
        print("Error in cancelInterview:", str(e))
        return Response({"message": "An error occurred", "error": str(e)}, status=500)