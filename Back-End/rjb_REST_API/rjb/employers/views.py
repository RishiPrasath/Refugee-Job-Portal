from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rjb.models import EmployerProfile, JobPosting, Skill, JobRequiresSkill, Application
from django.db.models import Q


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
    print("Job ID:", job_id)
    print("Username:", username)

    # Get job based on job_id and and related employer
    employer = EmployerProfile.objects.get(user__username=username)
    job = JobPosting.objects.get(id=job_id, employer=employer)
    print("Employer:", employer.company_name)
    print("Job:", job.job_title)

    #get all Applications related to Job posting object

    applications = Application.objects.filter(job=job).values()

    

    #return response with fields from job object and list of applications
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
        application_details.append({
            "applicant": application['applicant_id'],
            "cover_letter": application['cover_letter'],
            "cv": application['cv'],
            "status": application['status'],
        })

    print("Application details:", application_details)

    response_data = {
        "job_details": job_details,
        "applications": application_details,
    }
    
    return Response(response_data)



