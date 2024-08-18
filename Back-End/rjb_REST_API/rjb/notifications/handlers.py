from django.dispatch import receiver
from .signals import (
    create_interview, cancel_interview, create_job_posting, apply_for_job,
    create_job_offer, approve_job_offer, reject_job_offer, reject_candidate,
    approve_candidate, candidate_profile_update, employer_profile_update,
    create_candidate, create_employer
)

from rjb.models import *
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.conf import settings
from django.http import HttpRequest
from django.utils import timezone

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone
from django.dispatch import receiver
from .signals import create_candidate


# Fetch all Hiring Coordinators
def get_all_hiring_coordinators():
    return User.objects.filter(role='Hiring Coordinator')

@receiver(create_interview)
def handle_create_interview(sender, **kwargs):
    application = kwargs.get('application')
    candidate = kwargs.get('candidate')
    company_logo_url = kwargs.get('company_logo_url')  # Get the logo URL from kwargs
    employer = application.job.employer

    print("Application:", application.id)
    print("Candidate:", candidate.id)
    print("Employer:", employer.id)
    print("Company Logo URL:", company_logo_url)

    # Create Notification object for the candidate
    candidate_notification = Notification.objects.create(
        message=f"A new interview has been scheduled for your application to {application.job.job_title}.",
        recipient=candidate.user,
        owner=employer.user,
        routetopage=f"/candidate-upcoming-interviews"
    )

    # Create Notification objects for all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"A new interview has been scheduled for {candidate.full_name}'s application to {application.job.job_title}.",
            recipient=hc,
            owner=employer.user,
            routetopage=f"/candidate-view/{candidate.id}"
        )

    # Create Event object
    event = Event.objects.create(
        owner=employer.user,
        description=f"{employer.company_name} has scheduled an interview for {candidate.full_name} for the position of {application.job.job_title}."
    )

    # Form JSON for WebSocket data
    candidate_notification_json = {
        'description': candidate_notification.message,
        'recipient': candidate_notification.recipient.id,
        'owner': candidate_notification.owner.id,
        'routetopage': candidate_notification.routetopage,
        'created_at': candidate_notification.created_at.isoformat(),
        'notification_image': company_logo_url  # Use URL for image
    }
    
    # Send WebSocket data using User IDs
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notifications_{candidate.user.id}',
        {
            'type': 'notification_message',
            'message': candidate_notification_json
        }
    )

    # Send notifications to all Hiring Coordinators
    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': f"A new interview has been scheduled for {candidate.full_name}'s application to {application.job.job_title}.",
            'recipient': hc.id,
            'owner': employer.user.id,
            'routetopage': f"/candidate-view/{candidate.id}",
            'created_at': hiring_coordinator_notification.created_at.isoformat(),
            'notification_image': company_logo_url  # Use URL for image
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )

    # Send event notification to the employer
    event_json = {
        'description': event.description,
        'owner': event.owner.id,
        'created_at': event.created_at.isoformat(),
        'notification_image': company_logo_url  # Use URL for image
    }
    async_to_sync(channel_layer.group_send)(
        'events',
        {
            'type': 'event_message',
            'message': event_json
        }
    )

@receiver(cancel_interview)
def handle_cancel_interview(sender, **kwargs):
    # EVENT NAME: CancelInterview
    # Category: Interview
    # Event Owner: Employer
    # View File: Employer Views
    # Action: employers/cancelInterview
    # Description: Cancels an existing interview
    # Intended Recipients: Candidate related to application that is related to the interview, Hiring Coordinator
    # Page to Route To: Candidate - /candidate-upcoming-interviews, Hiring Coordinator - /candidate-view/:candidateId
    # Navigation Routing: /candidate-upcoming-interviews, /candidate-view/:candidateId
    # Notification Image: Company Logo
    # Message for each recipient:
    #   - Candidate: "Your interview for the {job_title} position has been canceled."
    #   - Hiring Coordinator: "The interview for {full_name}'s application to {job_title} has been canceled."
    application = kwargs.get('application')
    candidate = kwargs.get('candidate')
    company_logo_url = kwargs.get('company_logo_url')  # Get the logo URL from kwargs
    employer = application.job.employer

    print("Application:", application.id)
    print("Candidate:", candidate.id)
    print("Employer:", employer.id)
    print("Company Logo URL:", company_logo_url)

    # Create Notification object for the candidate
    candidate_notification = Notification.objects.create(
        message=f"Your interview for the {application.job.job_title} position has been canceled.",
        recipient=candidate.user,
        owner=employer.user,
        routetopage=f"/candidate-upcoming-interviews"
    )

    # Create Notification objects for all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"The interview for {candidate.full_name}'s application to {application.job.job_title} has been canceled.",
            recipient=hc,
            owner=employer.user,
            routetopage=f"/candidate-view/{candidate.id}"
        )

    # Form JSON for WebSocket data
    candidate_notification_json = {
        'description': candidate_notification.message,
        'recipient': candidate_notification.recipient.id,
        'owner': candidate_notification.owner.id,
        'routetopage': candidate_notification.routetopage,
        'created_at': candidate_notification.created_at.isoformat(),
        'notification_image': company_logo_url  # Use URL for image
    }
    
    # Send WebSocket data using User IDs
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notifications_{candidate.user.id}',
        {
            'type': 'notification_message',
            'message': candidate_notification_json
        }
    )

    # Send notifications to all Hiring Coordinators
    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': f"The interview for {candidate.full_name}'s application to {application.job.job_title} has been canceled.",
            'recipient': hc.id,
            'owner': employer.user.id,
            'routetopage': f"/candidate-view/{candidate.id}",
            'created_at': hiring_coordinator_notification.created_at.isoformat(),
            'notification_image': company_logo_url  # Use URL for image
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )

@receiver(create_job_posting)
def handle_create_job_posting(sender, **kwargs):
    # EVENT NAME: CreateJobPosting
    # Category: Job Posting
    # Event Owner: Employer
    # View File: Employer Views
    # Action: employers/addJobPosting
    # Description: Creates a new job posting
    # Intended Recipients: Candidates who have at least one similar skill to the job posting and also the candidate's related caseworker, Hiring Coordinator
    # Page to Route To: Candidate - /candidate-job-view/:company/:jobId, Hiring Coordinator - /jobposting-view/:jobId
    # Navigation Routing: /candidate-job-view/:company/:jobId, /jobposting-view/:jobId
    # Notification Image: Company Logo
    # Message for each recipient:
    #   - Candidates: "A new job posting for {job_title} at {company_name} is now available."
    #   - Hiring Coordinator: "A new job posting for {job_title} at {company_name} has been created."
    
    job_posting = kwargs.get('job_posting')
    employer = job_posting.employer
    company_logo_url = kwargs.get('company_logo_url')  # Get the logo URL from kwargs

    print("Job Posting:", job_posting.id)
    print("Employer:", employer.id)
    print("Company Logo URL:", company_logo_url)

    # Create Notification objects for candidates with similar skills
    candidates = CandidateProfile.objects.filter(skills__in=job_posting.skills.all()).distinct()
    
    print("Matching Candidates:")
    for candidate in candidates:
        print(f"Candidate ID: {candidate.id}, Name: {candidate.full_name}, Skills: {[skill.skill_name for skill in candidate.skills.all()]}")
    
    for candidate in candidates:
        candidate_notification = Notification.objects.create(
            message=f"A new job posting for {job_posting.job_title} at {employer.company_name} which matches your skills is now available.",
            recipient=candidate.user,
            owner=employer.user,
            routetopage=f"/candidate-job-view/{employer.company_name}/{job_posting.id}"
        )

    # Create Notification objects for all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"A new job posting for {job_posting.job_title} at {employer.company_name} has been created.",
            recipient=hc,
            owner=employer.user,
            routetopage=f"/jobposting-view/{job_posting.id}"
        )

    # Create Event object
    event = Event.objects.create(
        owner=employer.user,
        description=f"A new job posting for {job_posting.job_title} at {employer.company_name} has been created."
    )

    # Form JSON for WebSocket data
    channel_layer = get_channel_layer()
    for candidate in candidates:
        candidate_notification_json = {
            'description': f"A new job posting for {job_posting.job_title} at {employer.company_name} which matches your skills is now available.",
            'recipient': candidate.user.id,
            'owner': employer.user.id,
            'routetopage': f"/candidate-job-view/{employer.company_name}/{job_posting.id}",
            'created_at': timezone.now().isoformat(),
            'notification_image': company_logo_url  # Use URL for image
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{candidate.user.id}',
            {
                'type': 'notification_message',
                'message': candidate_notification_json
            }
        )

    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': f"A new job posting for {job_posting.job_title} at {employer.company_name} has been created.",
            'recipient': hc.id,
            'owner': employer.user.id,
            'routetopage': f"/jobposting-view/{job_posting.id}",
            'created_at': timezone.now().isoformat(),
            'notification_image': company_logo_url  # Use URL for image
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )

@receiver(apply_for_job)
def handle_apply_for_job(sender, **kwargs):
    print("Apply for Job Handler")
    # EVENT NAME: ApplyForJob
    # Category: New Applicant
    # Event Owner: Candidate
    # View File: Candidate Views
    # Action: candidates/submitJobApplication
    # Description: Submits a new job application
    # Intended Recipients: Employer related to job posting, Candidate's caseworker, Hiring Coordinator
    # Page to Route To: Employer - /jobapplication/:applicationId, Caseworker - /candidate/:email, Hiring Coordinator - /candidate-view/:candidateId
    # Navigation Routing: /jobapplication/:applicationId, /candidate/:email, /candidate-view/:candidateId
    # Notification Image: Profile Picture
    # Message for each recipient:
    #   - Employer: "A new application has been submitted for the {job_title} position."
    #   - Candidate's Caseworker: "{full_name} has applied for the {job_title} position."
    #   - Hiring Coordinator: "{full_name} has applied for the {job_title} position."

    application = kwargs.get('application')
    candidate = application.applicant
    job_posting = application.job
    employer = job_posting.employer
    caseworker = candidate.candidateprofile.case_worker  # Assuming there's a caseworker field in CandidateProfile
    candidate_profile_picture_url = kwargs.get('candidate_profile_picture_url')

    print("Application:", application.id)
    print("Candidate:", candidate.id)
    print("Job Posting:", job_posting.id)
    print("Employer:", employer.id)

    # Create Notification object for the employer
    employer_notification = Notification.objects.create(
        message=f"A new application has been submitted for the {job_posting.job_title} position.",
        recipient=employer.user,
        owner=candidate,
        routetopage=f"/jobapplication/{application.id}"
    )

    # Create Notification object for the candidate's caseworker
    if caseworker:
        caseworker_notification = Notification.objects.create(
            message=f"{candidate.candidateprofile.full_name} has applied for the {job_posting.job_title} position.",
            recipient=caseworker.user,
            owner=candidate,
            routetopage=f"/candidate/{candidate.email}"
        )

    # Create Notification objects for all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"{candidate.candidateprofile.full_name} has applied for the {job_posting.job_title} position.",
            recipient=hc,
            owner=candidate,
            routetopage=f"/candidate-view/{candidate.id}"
        )

    # Create Event object
    event = Event.objects.create(
        owner=candidate,
        description=f"{candidate.candidateprofile.full_name} has applied for the position of {job_posting.job_title} at {employer.company_name}."
    )

    # Form JSON for WebSocket data
    channel_layer = get_channel_layer()
    employer_notification_json = {
        'description': employer_notification.message,
        'recipient': employer_notification.recipient.id,
        'owner': employer_notification.owner.id,
        'routetopage': employer_notification.routetopage,
        'created_at': employer_notification.created_at.isoformat(),
        'notification_image': candidate_profile_picture_url  # Use candidate profile picture URL
    }
    async_to_sync(channel_layer.group_send)(
        f'notifications_{employer.user.id}',
        {
            'type': 'notification_message',
            'message': employer_notification_json
        }
    )

    if caseworker:
        caseworker_notification_json = {
            'description': caseworker_notification.message,
            'recipient': caseworker_notification.recipient.id,
            'owner': caseworker_notification.owner.id,
            'routetopage': caseworker_notification.routetopage,
            'created_at': caseworker_notification.created_at.isoformat(),
            'notification_image': candidate_profile_picture_url  # Use candidate profile picture URL
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{caseworker.user.id}',
            {
                'type': 'notification_message',
                'message': caseworker_notification_json
            }
        )

    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': f"{candidate.candidateprofile.full_name} has applied for the {job_posting.job_title} position.",
            'recipient': hc.id,
            'owner': candidate.id,
            'routetopage': f"/candidate-view/{candidate.id}",
            'created_at': timezone.now().isoformat(),
            'notification_image': candidate_profile_picture_url  # Use candidate profile picture URL
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )

@receiver(create_job_offer)
def handle_create_job_offer(sender, **kwargs):
    # EVENT NAME: CreateJobOffer
    # Category: Job Offer
    # Event Owner: Employer
    # View File: Employer Views
    # Action: employers/createJobOffer
    # Description: Creates a new job offer
    # Intended Recipients: Candidate related to job application, Candidate's caseworker, Hiring Coordinator
    # Page to Route To: Candidate - /candidate-job-offers, Case Worker - /candidate/:email, Hiring Coordinator - /jobapplication-view/:applicationId
    # Navigation Routing: /candidate-job-offers, /candidate/:email, /jobapplication-view/:applicationId
    # Notification Image: Company Logo
    # Message for each recipient:
    #   - Candidate: "You have received a job offer for the {job_title} position from {company_name}."
    #   - Candidate's Caseworker: "{full_name} has received a job offer for the {job_title} position from {company_name}."
    #   - Hiring Coordinator: "{full_name} has received a job offer for the {job_title} position from {company_name}."

    print("Create Job Offer Handler")
    job_offer = kwargs.get('job_offer')
    candidate = job_offer.candidate
    job_posting = job_offer.job_posting
    employer = job_posting.employer
    caseworker = candidate.case_worker  # Assuming there's a caseworker field in CandidateProfile
    company_logo_url = employer.logo.url if employer.logo else None

    print("Job Offer:", job_offer.id)
    print("Candidate:", candidate.id)
    print("Job Posting:", job_posting.id)
    print("Employer:", employer.id)

    # Create Notification object for the candidate
    candidate_notification = Notification.objects.create(
        message=f"You have received a job offer for the {job_posting.job_title} position from {employer.company_name}.",
        recipient=candidate.user,
        owner=employer.user,
        routetopage="/candidate-job-offers"
    )

    # Create Notification object for the candidate's caseworker
    if caseworker:
        caseworker_notification = Notification.objects.create(
            message=f"{candidate.full_name} has received a job offer for the {job_posting.job_title} position from {employer.company_name}.",
            recipient=caseworker.user,
            owner=employer.user,
            routetopage=f"/candidate/{candidate.user.email}"
        )

    # Create Notification objects for all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"{candidate.full_name} has received a job offer for the {job_posting.job_title} position from {employer.company_name}.",
            recipient=hc,
            owner=employer.user,
            routetopage=f"/jobapplication-view/{job_offer.application.id}"
        )

    # Create Event object
    event = Event.objects.create(
        owner=employer.user,
        description=f"{employer.company_name} has offered {candidate.full_name} the position of {job_posting.job_title}."
    )

    # Form JSON for WebSocket data
    channel_layer = get_channel_layer()
    candidate_notification_json = {
        'description': candidate_notification.message,
        'recipient': candidate_notification.recipient.id,
        'owner': candidate_notification.owner.id,
        'routetopage': candidate_notification.routetopage,
        'created_at': candidate_notification.created_at.isoformat(),
        'notification_image': company_logo_url  # Use company logo URL
    }
    async_to_sync(channel_layer.group_send)(
        f'notifications_{candidate.user.id}',
        {
            'type': 'notification_message',
            'message': candidate_notification_json
        }
    )

    if caseworker:
        caseworker_notification_json = {
            'description': caseworker_notification.message,
            'recipient': caseworker_notification.recipient.id,
            'owner': caseworker_notification.owner.id,
            'routetopage': caseworker_notification.routetopage,
            'created_at': caseworker_notification.created_at.isoformat(),
            'notification_image': company_logo_url  # Use company logo URL
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{caseworker.user.id}',
            {
                'type': 'notification_message',
                'message': caseworker_notification_json
            }
        )

    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': f"{candidate.full_name} has received a job offer for the {job_posting.job_title} position from {employer.company_name}.",
            'recipient': hc.id,
            'owner': employer.user.id,
            'routetopage': f"/jobapplication-view/{job_offer.application.id}",
            'created_at': timezone.now().isoformat(),
            'notification_image': company_logo_url  # Use company logo URL
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )

@receiver(approve_job_offer)
def handle_approve_job_offer(sender, **kwargs):
    # EVENT NAME: ApproveJobOffer
    # Category: Job Offer
    # Event Owner: Candidate
    # View File: Candidate Views
    # Action: candidates/approveJobOffer
    # Description: Approves a job offer
    # Intended Recipients: Employer, Candidate's caseworker, Hiring Coordinator
    # Page to Route To: Employer - /jobapplication/:applicationId, Caseworker - /candidate/:email, Hiring Coordinator - /jobapplication-view/:applicationId
    # Navigation Routing: /jobapplication/:applicationId, /candidate/:email, /jobapplication-view/:applicationId
    # Notification Image: Profile Picture
    # Message for each recipient:
    #   - Employer: "{full_name} has accepted the job offer for the {job_title} position."
    #   - Candidate's Caseworker: "{full_name} has accepted the job offer for the {job_title} position."
    #   - Hiring Coordinator: "{full_name} has accepted the job offer for the {job_title} position."

    job_offer = kwargs.get('job_offer')
    candidate = job_offer.candidate
    job_posting = job_offer.job_posting
    employer = job_posting.employer
    caseworker = candidate.case_worker  # Assuming there's a caseworker field in CandidateProfile
    candidate_profile_picture = kwargs.get('candidate_profile_picture')

    # Create Notification object for the employer
    employer_notification = Notification.objects.create(
        message=f"{candidate.full_name} has accepted the job offer for the {job_posting.job_title} position.",
        recipient=employer.user,
        owner=candidate.user,
        routetopage=f"/jobapplication/{job_offer.application.id}"
    )

    # Create Notification object for the candidate's caseworker
    if caseworker:
        caseworker_notification = Notification.objects.create(
            message=f"{candidate.full_name} has accepted the job offer for the {job_posting.job_title} position.",
            recipient=caseworker.user,
            owner=candidate.user,
            routetopage=f"/candidate/{candidate.user.email}"
        )

    # Create Notification objects for all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"{candidate.full_name} has accepted the job offer for the {job_posting.job_title} position.",
            recipient=hc,
            owner=candidate.user,
            routetopage=f"/jobapplication-view/{job_offer.application.id}"
        )

    # Create Event object
    event = Event.objects.create(
        owner=candidate.user,
        description=f"{candidate.full_name} has accepted the job offer for the {job_posting.job_title} position."
    )

    # Form JSON for WebSocket data
    channel_layer = get_channel_layer()
    employer_notification_json = {
        'description': employer_notification.message,
        'recipient': employer_notification.recipient.id,
        'owner': employer_notification.owner.id,
        'routetopage': employer_notification.routetopage,
        'created_at': employer_notification.created_at.isoformat(),
        'notification_image': candidate_profile_picture  # Use candidate profile picture
    }
    async_to_sync(channel_layer.group_send)(
        f'notifications_{employer.user.id}',
        {
            'type': 'notification_message',
            'message': employer_notification_json
        }
    )

    if caseworker:
        caseworker_notification_json = {
            'description': caseworker_notification.message,
            'recipient': caseworker_notification.recipient.id,
            'owner': caseworker_notification.owner.id,
            'routetopage': caseworker_notification.routetopage,
            'created_at': caseworker_notification.created_at.isoformat(),
            'notification_image': candidate_profile_picture  # Use candidate profile picture
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{caseworker.user.id}',
            {
                'type': 'notification_message',
                'message': caseworker_notification_json
            }
        )

    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': f"{candidate.full_name} has accepted the job offer for the {job_posting.job_title} position.",
            'recipient': hc.id,
            'owner': candidate.user.id,
            'routetopage': f"/jobapplication-view/{job_offer.application.id}",
            'created_at': timezone.now().isoformat(),
            'notification_image': candidate_profile_picture  # Use candidate profile picture
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )

@receiver(reject_job_offer)
def handle_reject_job_offer(sender, **kwargs):
    # EVENT NAME: RejectJobOffer
    # Category: Job Offer
    # Event Owner: Candidate
    # View File: Candidate Views
    # Action: candidates/rejectJobOffer
    # Description: Rejects a job offer
    # Intended Recipients: Employer, Candidate's caseworker, Hiring Coordinator
    # Page to Route To: Employer - /jobapplication/:applicationId, Caseworker - /candidate/:email, Hiring Coordinator - /jobapplication-view/:applicationId
    # Navigation Routing: /jobapplication/:applicationId, /candidate/:email, /jobapplication-view/:applicationId
    # Notification Image: Profile Picture
    # Message for each recipient:
    #   - Employer: "{full_name} has declined the job offer for the {job_title} position."
    #   - Candidate's Caseworker: "{full_name} has declined the job offer for the {job_title} position."
    #   - Hiring Coordinator: "{full_name} has declined the job offer for the {job_title} position."
    job_offer = kwargs.get('job_offer')
    candidate = job_offer.candidate
    job_posting = job_offer.job_posting
    employer = job_posting.employer
    caseworker = candidate.case_worker  # Assuming there's a caseworker field in CandidateProfile
    candidate_profile_picture = kwargs.get('candidate_profile_picture')

    # Create Notification object for the employer
    employer_notification = Notification.objects.create(
        message=f"{candidate.full_name} has declined the job offer for the {job_posting.job_title} position.",
        recipient=employer.user,
        owner=candidate.user,
        routetopage=f"/jobapplication/{job_offer.application.id}"
    )

    # Create Notification object for the candidate's caseworker
    if caseworker:
        caseworker_notification = Notification.objects.create(
            message=f"{candidate.full_name} has declined the job offer for the {job_posting.job_title} position.",
            recipient=caseworker.user,
            owner=candidate.user,
            routetopage=f"/candidate/{candidate.user.email}"
        )

    # Create Notification objects for all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"{candidate.full_name} has declined the job offer for the {job_posting.job_title} position.",
            recipient=hc,
            owner=candidate.user,
            routetopage=f"/jobapplication-view/{job_offer.application.id}"
        )

    # Create Event object
    event = Event.objects.create(
        owner=candidate.user,
        description=f"{candidate.full_name} has declined the job offer for the {job_posting.job_title} position."
    )

    # Form JSON for WebSocket data
    channel_layer = get_channel_layer()
    employer_notification_json = {
        'description': employer_notification.message,
        'recipient': employer_notification.recipient.id,
        'owner': employer_notification.owner.id,
        'routetopage': employer_notification.routetopage,
        'created_at': employer_notification.created_at.isoformat(),
        'notification_image': candidate_profile_picture  # Use candidate profile picture
    }
    async_to_sync(channel_layer.group_send)(
        f'notifications_{employer.user.id}',
        {
            'type': 'notification_message',
            'message': employer_notification_json
        }
    )

    if caseworker:
        caseworker_notification_json = {
            'description': caseworker_notification.message,
            'recipient': caseworker_notification.recipient.id,
            'owner': caseworker_notification.owner.id,
            'routetopage': caseworker_notification.routetopage,
            'created_at': caseworker_notification.created_at.isoformat(),
            'notification_image': candidate_profile_picture  # Use candidate profile picture
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{caseworker.user.id}',
            {
                'type': 'notification_message',
                'message': caseworker_notification_json
            }
        )

    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': f"{candidate.full_name} has declined the job offer for the {job_posting.job_title} position.",
            'recipient': hc.id,
            'owner': candidate.user.id,
            'routetopage': f"/jobapplication-view/{job_offer.application.id}",
            'created_at': timezone.now().isoformat(),
            'notification_image': candidate_profile_picture  # Use candidate profile picture
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )

@receiver(reject_candidate)
def handle_reject_candidate(sender, **kwargs):
    # EVENT NAME: RejectCandidate
    # Category: Application Update
    # Event Owner: Employer
    # View File: Employer Views
    # Action: employers/rejectApplication
    # Description: Rejects an application
    # Intended Recipients: Candidate, Candidate's caseworker, Hiring Coordinator
    # Page to Route To: Candidate - /job-applications, Case Worker - /candidate/:email, Hiring Coordinator - /candidate-view/:candidateId
    # Navigation Routing: /job-applications, /candidate/:email, /candidate-view/:candidateId
    # Notification Image: Company Logo
    # Message for each recipient:
    #   - Candidate: "Your application for the {job_title} position from {company_name} has been rejected."
    #   - Candidate's Caseworker: "{full_name}'s application for the {job_title} position from {company_name} has been rejected."
    #   - Hiring Coordinator: "{full_name}'s application for the {job_title} position from {company_name} has been rejected."
    application = kwargs.get('application')
    candidate = application.applicant
    job_posting = application.job
    employer = job_posting.employer
    caseworker = candidate.candidateprofile.case_worker  # Assuming there's a caseworker field in CandidateProfile
    employer_logo_path = kwargs.get('employer_logo_path')

    # Create Notification object for the candidate
    candidate_notification = Notification.objects.create(
        message=f"Your application for the {job_posting.job_title} position from {employer.company_name} has been rejected.",
        recipient=candidate,
        owner=employer.user,
        routetopage="/job-applications"
    )

    # Create Notification object for the candidate's caseworker
    if caseworker:
        caseworker_notification = Notification.objects.create(
            message=f"{candidate.candidateprofile.full_name}'s application for the {job_posting.job_title} position from {employer.company_name} has been rejected.",
            recipient=caseworker.user,
            owner=employer.user,
            routetopage=f"/candidate/{candidate.email}"
        )

    # Create Notification objects for all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"{candidate.candidateprofile.full_name}'s application for the {job_posting.job_title} position from {employer.company_name} has been rejected.",
            recipient=hc,
            owner=employer.user,
            routetopage=f"/candidate-view/{candidate.id}"
        )

    # Create Event object
    event = Event.objects.create(
        owner=employer.user,
        description=f"{candidate.candidateprofile.full_name}'s application for the {job_posting.job_title} position from {employer.company_name} has been rejected."
    )

    # Form JSON for WebSocket data
    channel_layer = get_channel_layer()
    candidate_notification_json = {
        'description': candidate_notification.message,
        'recipient': candidate_notification.recipient.id,
        'owner': candidate_notification.owner.id,
        'routetopage': candidate_notification.routetopage,
        'created_at': candidate_notification.created_at.isoformat(),
        'notification_image': employer_logo_path  # Use employer logo path
    }
    async_to_sync(channel_layer.group_send)(
        f'notifications_{candidate.id}',
        {
            'type': 'notification_message',
            'message': candidate_notification_json
        }
    )

    if caseworker:
        caseworker_notification_json = {
            'description': caseworker_notification.message,
            'recipient': caseworker_notification.recipient.id,
            'owner': caseworker_notification.owner.id,
            'routetopage': caseworker_notification.routetopage,
            'created_at': caseworker_notification.created_at.isoformat(),
            'notification_image': employer_logo_path  # Use employer logo path
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{caseworker.user.id}',
            {
                'type': 'notification_message',
                'message': caseworker_notification_json
            }
        )

    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': f"{candidate.candidateprofile.full_name}'s application for the {job_posting.job_title} position from {employer.company_name} has been rejected.",
            'recipient': hc.id,
            'owner': employer.user.id,
            'routetopage': f"/candidate-view/{candidate.id}",
            'created_at': timezone.now().isoformat(),
            'notification_image': employer_logo_path  # Use employer logo path
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )



''' To be refined'''
@receiver(approve_candidate)
def handle_approve_candidate(sender, **kwargs):
    # EVENT NAME: ApproveCandidate
    # Category: Application Update
    # Event Owner: Employer
    # View File: Employer Views
    # Action: employers/approveApplication
    # Description: Implicitly approves an application
    # Intended Recipients: Candidate, Candidate's caseworker, Hiring Coordinator
    # Page to Route To: Candidate - /candidate-job-offers, Case Worker - /candidate/:email, Hiring Coordinator - /jobapplication-view/:applicationId
    # Navigation Routing: /candidate-job-offers, /candidate/:email, /jobapplication-view/:applicationId
    # Notification Image: Company Logo
    # Message for each recipient:
    #   - Candidate: "Your application for the {job_title} position from {company_name} has been approved."
    #   - Candidate's Caseworker: "{full_name}'s application for the {job_title} position from {company_name} has been approved."
    #   - Hiring Coordinator: "{full_name}'s application for the {job_title} position from {company_name} has been approved."
    pass
''' To be refined'''




@receiver(candidate_profile_update)
def handle_candidate_profile_update(sender, **kwargs):
    print("handle_candidate_profile_update")
    # EVENT NAME: CandidateProfileUpdate
    # Category: Profile Update
    # Event Owner: Candidate
    # View File: Candidate Views
    # Action: candidates/updateProfile
    # Description: Updates candidate profile
    # Intended Recipients: Candidate's caseworker, Hiring Coordinator
    # Page to Route To: Hiring Coordinator - /candidate-view/:candidateId, Case Worker - /candidate/:email
    # Navigation Routing: /candidate-view/:candidateId, /candidate/:email
    # Notification Image: Profile Picture
    # Message for each recipient:
    #   - Candidate's Caseworker: "{full_name} has updated their profile."
    #   - Hiring Coordinator: "Candidate {full_name} has updated their profile."

    candidate_profile_picture_url = kwargs.get('candidate_profile_picture_url')
    candidate = kwargs.get('candidate')
    caseworker = candidate.case_worker  # Assuming there's a caseworker field in CandidateProfile

    # Create Notification object for the candidate's caseworker
    if caseworker:
        caseworker_notification = Notification.objects.create(
            message=f"{candidate.full_name} has updated their profile.",
            recipient=caseworker.user,
            owner=candidate.user,
            routetopage=f"/candidate/{candidate.user.email}"
        )

    # Create Notification objects for all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"Candidate {candidate.full_name} has updated their profile.",
            recipient=hc,
            owner=candidate.user,
            routetopage=f"/candidate-view/{candidate.user.id}"
        )

    # Create Event object
    event = Event.objects.create(
        owner=candidate.user,
        description=f"{candidate.full_name} has updated their profile."
    )

    # Form JSON for WebSocket data
    channel_layer = get_channel_layer()
    if caseworker:
        caseworker_notification_json = {
            'description': caseworker_notification.message,
            'recipient': caseworker_notification.recipient.id,
            'owner': caseworker_notification.owner.id,
            'routetopage': caseworker_notification.routetopage,
            'created_at': caseworker_notification.created_at.isoformat(),
            'notification_image': candidate_profile_picture_url  # Use candidate profile picture URL
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{caseworker.user.id}',
            {
                'type': 'notification_message',
                'message': caseworker_notification_json
            }
        )

    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': f"Candidate {candidate.full_name} has updated their profile.",
            'recipient': hc.id,
            'owner': candidate.user.id,
            'routetopage': f"/candidate-view/{candidate.user.id}",
            'created_at': timezone.now().isoformat(),
            'notification_image': candidate_profile_picture_url  # Use candidate profile picture URL
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )

@receiver(employer_profile_update)
def handle_employer_profile_update(sender, **kwargs):
    # EVENT NAME: EmployerProfileUpdate
    # Category: Profile Update
    # Event Owner: Employer
    # View File: Employer Views
    # Action: employers/updateProfile
    # Description: Updates employer profile
    # Intended Recipients: Hiring Coordinator
    # Page to Route To: Hiring Coordinator - /employer-view/:employerId
    # Navigation Routing: /employer-view/:employerId
    # Notification Image: Company Logo
    # Message for each recipient:
    #   - Hiring Coordinator: "{company_name} has updated their profile."

    employer_profile = kwargs.get('employer_profile')
    employer_logo_path = kwargs.get('employer_logo_path')

    # Fetch all Hiring Coordinators
    hiring_coordinators = get_all_hiring_coordinators()

    # Create Notification objects for all Hiring Coordinators
    for hc in hiring_coordinators:
        hiring_coordinator_notification = Notification.objects.create(
            message=f"{employer_profile.company_name} has updated their profile.",
            recipient=hc,
            owner=employer_profile.user,
            routetopage=f"/employer-view/{employer_profile.id}"
        )

    # Create Event object
    event = Event.objects.create(
        owner=employer_profile.user,
        description=f"{employer_profile.company_name} has updated their profile."
    )

    # Form JSON for WebSocket data
    channel_layer = get_channel_layer()
    for hc in hiring_coordinators:
        hiring_coordinator_notification_json = {
            'description': hiring_coordinator_notification.message,
            'recipient': hc.id,
            'owner': employer_profile.user.id,
            'routetopage': f"/employer-view/{employer_profile.id}",
            'created_at': hiring_coordinator_notification.created_at.isoformat(),
            'notification_image': employer_logo_path  # Use employer logo path
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{hc.id}',
            {
                'type': 'notification_message',
                'message': hiring_coordinator_notification_json
            }
        )



@receiver(create_candidate)
def handle_create_candidate(sender, **kwargs):
    print("handle_create_candidate")
    candidate_profile = kwargs.get('candidate_profile')
    profile_picture_url = kwargs.get('profile_picture_url')

    # Create notifications for all hiring coordinators and the related case worker
    hiring_coordinator_message = f"A new candidate account has been created for {candidate_profile.full_name}."
    case_worker_message = f"A new candidate account has been created for {candidate_profile.full_name} and assigned to you."

    # Get all hiring coordinators
    hiring_coordinators = User.objects.filter(role='Hiring Coordinator')

    # Create notifications for all hiring coordinators
    hiring_coordinator_notifications = []
    for coordinator in hiring_coordinators:
        notification = Notification.objects.create(
            message=hiring_coordinator_message,
            recipient=coordinator,
            owner=candidate_profile.user,
            dismissed=False,
            routetopage=f"/candidate-view/{candidate_profile.id}",
        )
        hiring_coordinator_notifications.append(notification)

    # Create notification for the related case worker
    case_worker_notification = Notification.objects.create(
        message=case_worker_message,
        recipient=candidate_profile.case_worker.user,
        owner=candidate_profile.user,
        dismissed=False,
        routetopage=f"/candidate/{candidate_profile.user.email}",
    )

    event = Event.objects.create(
        owner=candidate_profile.user,
        description=f"A new candidate account has been created for {candidate_profile.full_name}."
    )

    # WebSocket notifications and events
    channel_layer = get_channel_layer()

    # Notifications for Hiring Coordinators
    for notification in hiring_coordinator_notifications:
        notification_json = {
            'description': notification.message,
            'recipient': notification.recipient.id,
            'owner': notification.owner.id,
            'routetopage': notification.routetopage,
            'created_at': notification.created_at.isoformat(),
            'notification_image': profile_picture_url
        }
        async_to_sync(channel_layer.group_send)(
            f'notifications_{notification.recipient.id}',
            {
                'type': 'notification_message',
                'message': notification_json
            }
        )

    # Notification for Case Worker
    case_worker_notification_json = {
        'description': case_worker_notification.message,
        'recipient': case_worker_notification.recipient.id,
        'owner': case_worker_notification.owner.id,
        'routetopage': case_worker_notification.routetopage,
        'created_at': case_worker_notification.created_at.isoformat(),
        'notification_image': profile_picture_url
    }
    async_to_sync(channel_layer.group_send)(
        f'notifications_{candidate_profile.case_worker.user.id}',
        {
            'type': 'notification_message',
            'message': case_worker_notification_json
        }
    )

    # Event notification
    event_json = {
        'description': event.description,
        'owner': event.owner.id,
        'created_at': event.created_at.isoformat(),
        'notification_image': profile_picture_url
    }
    async_to_sync(channel_layer.group_send)(
        'events',
        {
            'type': 'event_message',
            'message': event_json
        }
    )






@receiver(create_employer)
def handle_create_employer(sender, **kwargs):
    # EVENT NAME: CreateEmployerAccount
    # Category: Account Creation
    # Event Owner: Auth Views
    # View File: register_employer
    # Action: register_employer
    # Description: Creates a new employer account
    # Intended Recipients: Hiring Coordinator
    # Page to Route To: Hiring Coordinator - /employer-view/:employerId
    # Navigation Routing: /employer-view/:employerId
    # Notification Image: Company Logo
    # Message for each recipient:
    #   - Hiring Coordinator: "A new employer account has been created for {company_name}."
    pass