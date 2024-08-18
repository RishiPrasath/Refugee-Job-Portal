from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rjb.models import EmployerProfile, JobPosting, Skill, JobRequiresSkill, Application, CandidateProfile, User, Qualification, WorkExperience, Interview, JobOffer
from django.db.models import Q
import base64
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import datetime, time
from django.http import FileResponse
import os
from django.shortcuts import get_object_or_404
from rjb.notifications.signals import *
from django.http import HttpRequest
from rjb.notifications.signals import create_interview  # Ensure this import is present

# Home view for the employer portal
@api_view(['GET'])
def home(request):
    data = {
        "message": "Welcome to the Employer Portal",
        "status": "success"
    }
    return Response(data)

# View to add a new job posting
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

        # Construct the URL for the company logo
        company_logo_url = request.build_absolute_uri(employer.logo.url) if employer.logo else None

        # Trigger the create_job_posting signal and pass the logo URL
        create_job_posting.send(sender=addJobPosting, job_posting=job_posting, company_logo_url=company_logo_url)

        return Response({"message": "Job posting added successfully", "data": data})

    except Exception as e:
        print("Error in addJobPosting:", str(e))
        return Response({"message": "An error occurred", "error": str(e)}, status=500)

# View to get all job postings for an employer
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

# View to get details of a specific job posting
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

# View to get details of a specific candidate application
@api_view(['GET'])
def getCandidateApplicationDetails(request, application_id):
    try:
        print("Application ID:", application_id)
        application = Application.objects.get(id=application_id)
        candidate_profile = application.applicant.candidateprofile

        # Print file name of CV
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
            "immigration_status": candidate_profile.immigration_status,
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

# View to create a new interview
@api_view(['POST'])
def createInterview(request: HttpRequest):
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
            status='Scheduled'
        )
        interview.save()
        
        # Fetch the candidate profile using the applicant (user) from the application
        candidate = CandidateProfile.objects.get(user=application.applicant)

        # Construct the URL for the company logo
        company_logo_url = request.build_absolute_uri(application.job.employer.logo.url) if application.job.employer.logo else None

        # Trigger the create_interview signal and pass the logo URL
        create_interview.send(sender=createInterview, application=application, candidate=candidate, company_logo_url=company_logo_url)
        
        print("Signal sent")

        return Response({"message": "Interview created successfully", "interview": interview.id}, status=201)
    except CandidateProfile.DoesNotExist:
        return Response({"message": "Candidate profile not found for the applicant"}, status=404)
    except Exception as e:
        print("Error in createInterview:", str(e))  # Debug print to check the error
        return Response({"message": "An error occurred", "error": str(e)}, status=500)

# View to get interviews by status
@api_view(['GET'])
def getInterviewsByStatus(request):
    application_id = request.query_params.get('application_id')
    status = request.query_params.get('status')

    print("Application ID:", application_id)
    print("Status:", status)

    if not application_id or not status:
        return Response({"error": "Application ID and status are required parameters."}, status=400)

    try:
        interviews = Interview.objects.filter(
            application__id=application_id,
            status=status
        ).values()

        print("Interviews:", list(interviews))

        return Response({"interviews": list(interviews)}, status=200)
    except Exception as e:
        print("Error in getInterviewsByStatus:", str(e))
        return Response({"error": str(e)}, status=500)

# View to update an existing interview
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

# View to cancel an interview
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

        # Fetch the candidate profile using the applicant (user) from the application
        candidate = CandidateProfile.objects.get(user=application.applicant)

        # Construct the URL for the company logo
        company_logo_url = request.build_absolute_uri(application.job.employer.logo.url) if application.job.employer.logo else None

        # Trigger the cancel_interview signal and pass the logo URL
        cancel_interview.send(sender=cancelInterview, application=application, candidate=candidate, company_logo_url=company_logo_url)

        return Response({"message": "Interview cancelled successfully", "interview": interview.id}, status=200)
    except CandidateProfile.DoesNotExist:
        return Response({"message": "Candidate profile not found for the applicant"}, status=404)
    except Exception as e:
        print("Error in cancelInterview:", str(e))
        return Response({"message": "An error occurred", "error": str(e)}, status=500)

# View to close an interview
@api_view(['POST'])
def closeInterview(request):
    try:
        data = request.data
        interview_id = data.get('id')
        feedback = data.get('feedback')
        if not interview_id:
            return Response({"message": "Interview ID is required"}, status=400)
        if not feedback:
            return Response({"message": "Feedback is required"}, status=400)

        try:
            interview = Interview.objects.get(id=interview_id)
        except Interview.DoesNotExist:
            return Response({"message": "Interview not found"}, status=404)

        interview.status = 'Closed'
        interview.feedback = feedback
        interview.save()

        # Update the application status
        application = interview.application
        application.status = 'Interview Closed'
        application.save()

        return Response({"message": "Interview closed successfully", "interview": interview.id}, status=200)
    except Exception as e:
        print("Error in closeInterview:", str(e))
        return Response({"message": "An error occurred", "error": str(e)}, status=500)

# View to get upcoming interviews
@api_view(['GET'])
def getUpcomingInterviews(request):
    company_name = request.query_params.get('company_name')

    print("Company name:", company_name)

    if not company_name:
        return Response({"error": "Company name is required"}, status=400)

    try:
        # Get the employer profile
        employer = EmployerProfile.objects.get(company_name=company_name)

        print("Employer:", employer)

        # Get job postings related to the employer
        job_postings = JobPosting.objects.filter(employer=employer)

        print("Job postings:", job_postings)

        # Get applications related to the job postings
        applications = Application.objects.filter(job__in=job_postings)

        print("Applications:", applications)

        # Get interviews related to the applications
        interviews = Interview.objects.filter(application__in=applications, status__in=['Scheduled', 'Rescheduled','Cancelled']).select_related('application__applicant__candidateprofile')

        interview_list = []
        for interview in interviews:
            candidate_profile = interview.application.applicant.candidateprofile
            interview_data = {
                "id": interview.id,
                "interview_type": interview.interview_type,
                "date": interview.date,
                "start_time": interview.start_time,
                "end_time": interview.end_time,
                "interview_location": interview.interview_location,
                "meeting_link": interview.meeting_link,
                "additional_details": interview.additional_details,
                "status": interview.status,
                "feedback": interview.feedback,
                "job_title": interview.application.job.job_title,
                "candidate_full_name": candidate_profile.full_name,
                "candidate_phone": candidate_profile.contact_phone,
                "candidate_email": candidate_profile.user.email,
            }
            
            # Add candidate profile picture base64
            if candidate_profile.profile_picture:
                with open(candidate_profile.profile_picture.path, "rb") as image_file:
                    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                interview_data["candidate_profile_pic"] = f"data:image/png;base64,{encoded_image}"
            else:
                interview_data["candidate_profile_pic"] = None
            
            interview_list.append(interview_data)

        print("Interviews:", interview_list)

        return Response({"interviews": interview_list}, status=200)
    except EmployerProfile.DoesNotExist:
        return Response({"error": "Employer not found"}, status=404)
    except Exception as e:
        print("Error in getUpcomingInterviews:", str(e))
        return Response({"error": str(e)}, status=500)

# View to get job offer details for a specific application
@api_view(['GET'])
def getJobOffer(request, application_id):
    try:
        job_offer = JobOffer.objects.filter(application__id=application_id).first()
        if job_offer:
            job_offer_data = {
                "id": job_offer.id,
                "job_offer_document": request.build_absolute_uri(job_offer.job_offer_document.url) if job_offer.job_offer_document else None,
                "additional_details": job_offer.additional_details,
                "offer_datetime": job_offer.offer_datetime,
                "status": job_offer.status,
            }
            return Response(job_offer_data, status=200)
        else:
            return Response({"message": "No job offer associated with this application"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# View to create a new job offer
@api_view(['POST'])
def createJobOffer(request):
    try:
        application_id = request.data.get('applicationId')
        additional_details = request.data.get('additionalDetails')
        job_offer_document = request.FILES.get('jobOfferDocument')

        print('OK')



        print("Application ID:", application_id)
        print("Additional details:", additional_details)
        print("Job offer document:", job_offer_document)

        if not application_id:
            return Response({"message": "Application ID is required"}, status=400)

        try:
            application = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return Response({"message": "Application not found"}, status=404)

        job_offer = JobOffer(
            application=application,
            job_posting=application.job,
            employer=application.job.employer,
            candidate=application.applicant.candidateprofile,
            job_offer_document=job_offer_document,
            additional_details=additional_details,
            offer_datetime=timezone.now()
        )
        job_offer.save()

        application.status = 'Approved'
        application.save()

        # Trigger the signal
        create_job_offer.send(sender=createJobOffer.__class__, job_offer=job_offer)

        return Response({"message": "Job offer created successfully", "job_offer": job_offer.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("Error in createJobOffer:", str(e))  # Debug print to check the error
        return Response({"message": "An error occurred", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# View to update an existing job offer
@api_view(['POST'])
def updateJobOffer(request):
    try:
        job_offer_id = request.data.get('jobOfferId')
        additional_details = request.data.get('additionalDetails')
        job_offer_document = request.FILES.get('jobOfferDocument')

       

        # Debugging
        print("Job offer ID:", job_offer_id)
        print("Additional details:", additional_details)
        print("Job offer document:", job_offer_document)

        if not job_offer_id:
            return Response({"message": "Job Offer ID is required"}, status=400)

        job_offer = get_object_or_404(JobOffer, id=job_offer_id)

        # Update additional details
        job_offer.additional_details = additional_details

        # Update job offer document
        if job_offer_document:
            # Delete the old document
            if job_offer.job_offer_document:
                if os.path.isfile(job_offer.job_offer_document.path):
                    os.remove(job_offer.job_offer_document.path)
            # Save the new document
            job_offer.job_offer_document.save(job_offer_document.name, job_offer_document)

        # Update job offer status to 'Pending'
        job_offer.status = 'Pending'

        job_offer.save()

        job_offer_data = {
            "job_offer_document": request.build_absolute_uri(job_offer.job_offer_document.url) if job_offer.job_offer_document else None,
            "additional_details": job_offer.additional_details,
            "offer_datetime": job_offer.offer_datetime,
            "status": job_offer.status,
        }

        return Response(job_offer_data, status=200)
    except Exception as e:
        print("Error in updateJobOffer:", str(e))
        return Response({"message": "An error occurred", "error": str(e)}, status=500)

# View to reject a candidate application
@api_view(['POST'])
def rejectApplication(request):
    try:
        data = request.data
        application_id = data.get('application_id')
        if not application_id:
            return Response({"message": "Application ID is required"}, status=400)

        try:
            application = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return Response({"message": "Application not found"}, status=404)

        application.status = 'Rejected'
        application.save()

        # Get the absolute path of the employer's logo
        employer_profile = application.job.employer
        employer_logo_path = request.build_absolute_uri(employer_profile.logo.url) if employer_profile.logo else None

        # Trigger the signal
        reject_candidate.send(
            sender=rejectApplication.__class__,
            application=application,
            employer_logo_path=employer_logo_path
        )

        return Response({"message": "Application rejected successfully", "application": application.id}, status=200)
    except Exception as e:
        print("Error in rejectApplication:", str(e))
        return Response({"message": "An error occurred", "error": str(e)}, status=500)

# View to get employer profile
@api_view(['GET'])
def getProfile(request):
    try:
        username = request.query_params.get('username')
        email = request.query_params.get('email')
        if not username or not email:
            return Response({"error": "Username and email are required"}, status=400)

        user = User.objects.get(username=username, email=email)
        employer_profile = EmployerProfile.objects.get(user=user)

        profile_data = {
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "company_name": employer_profile.company_name,
            "industry": employer_profile.industry,
            "contact_phone": employer_profile.contact_phone,
            "location": employer_profile.location,
            "website_url": employer_profile.website_url,
            "logo": request.build_absolute_uri(employer_profile.logo.url) if employer_profile.logo else None,
            "description": employer_profile.description,
            "is_active": employer_profile.is_active,
        }

        return Response(profile_data, status=200)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except EmployerProfile.DoesNotExist:
        return Response({"error": "Employer profile not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@csrf_exempt
def updateProfile(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        
        if not username or not email:
            return Response({"error": "Username and email are required"}, status=400)

        user = get_object_or_404(User, username=username, email=email)
        employer_profile = get_object_or_404(EmployerProfile, user=user)

        # Update fields
        employer_profile.company_name = request.data.get('company_name', employer_profile.company_name)
        employer_profile.industry = request.data.get('industry', employer_profile.industry)
        employer_profile.contact_phone = request.data.get('contact_phone', employer_profile.contact_phone)
        employer_profile.location = request.data.get('location', employer_profile.location)
        employer_profile.website_url = request.data.get('website_url', employer_profile.website_url)
        employer_profile.description = request.data.get('description', employer_profile.description)

        employer_profile.save()

        # Get the absolute path of the employer's logo
        employer_logo_path = request.build_absolute_uri(employer_profile.logo.url) if employer_profile.logo else None

        # Trigger the signal
        employer_profile_update.send(
            sender=updateProfile.__class__,
            employer_profile=employer_profile,
            employer_logo_path=employer_logo_path
        )

        return Response({"message": "Profile updated successfully"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)