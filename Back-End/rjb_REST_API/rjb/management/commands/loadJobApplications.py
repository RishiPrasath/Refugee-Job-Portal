import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from rjb.models import CandidateProfile, JobPosting, User, Application
from fpdf import FPDF

class ResumePDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, 'Resume', 0, 1, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, title, 0, 1, 'L')
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 12)
        self.multi_cell(0, 10, body)
        self.ln()

def generate_resume(candidate, job_id):
    pdf = ResumePDF()
    pdf.add_page()

    # Personal Information
    pdf.chapter_title('Personal Information')
    personal_info = (
        f"Full Name: {candidate.full_name}\n"
        f"Date of Birth: {candidate.date_of_birth}\n"
        f"Contact Phone: {candidate.contact_phone}\n"
        f"Email: {candidate.user.email}\n"
        f"LinkedIn: {candidate.linkedin_profile}\n"
        f"GitHub: {candidate.github_profile}\n"
        f"Emergency Contact Name: {candidate.emergency_contact_name}\n"
        f"Emergency Contact Phone: {candidate.emergency_contact_phone}\n"
        f"Immigration Status: {candidate.immigration_status}"
    )
    pdf.chapter_body(personal_info)

    # Summary
    pdf.chapter_title('Summary')
    pdf.chapter_body(candidate.summary)

    # Skills
    pdf.chapter_title('Skills')
    skills = "\n".join([skill.skill_name for skill in candidate.skills.all()])
    pdf.chapter_body(skills)

    # Qualifications
    pdf.chapter_title('Qualifications')
    qualifications = "\n".join([f"{q.qualification} from {q.school} ({q.start_year} - {q.end_year})" for q in candidate.qualification_set.all()])
    pdf.chapter_body(qualifications)

    # Work Experience
    pdf.chapter_title('Work Experience')
    work_experiences = "\n".join([f"{w.role} at {w.company} ({w.start_year} - {w.end_year})" for w in candidate.workexperience_set.all()])
    pdf.chapter_body(work_experiences)

    # Save the PDF
    resume_directory = os.path.join('Back-End/rjb_REST_API/rjb/management/commands/mock_data/mockResumes')
    os.makedirs(resume_directory, exist_ok=True)
    resume_path = os.path.join(resume_directory, f"{candidate.user.id}_{job_id}.pdf")
    pdf.output(resume_path)

    # Ensure the path uses forward slashes
    return resume_path.replace("\\", "/")

class Command(BaseCommand):
    help = 'Load job applications from mock data and generate resumes'

    def handle(self, *args, **kwargs):
        # Load the JSON for applications
        mock_data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'mock_data', 'mockApplicationsData.json'))
        with open(mock_data_path, 'r') as file:
            applications_data = json.load(file)
        print("Applications data loaded from mockApplicationsData.json")

        valid_applications = []
        invalid_applications = []

        for application in applications_data:
            job_exists = JobPosting.objects.filter(id=application['job_id']).exists()
            applicant_exists = User.objects.filter(id=application['applicant_user_id']).exists()

            if job_exists and applicant_exists:
                valid_applications.append(application)
            else:
                invalid_applications.append(application)

        if invalid_applications:
            print(f"Invalid applications count: {len(invalid_applications)}")
            invalid_applications_file_path = os.path.abspath(os.path.join('Back-End/rjb_REST_API/rjb/management/commands/mock_data', 'invalid_applications.json'))
            with open(invalid_applications_file_path, 'w') as file:
                file.write(json.dumps(invalid_applications, indent=4))
            print("Invalid applications data written to invalid_applications.json")

        final_applications = []
        for application in valid_applications:
            job = JobPosting.objects.get(id=application['job_id'])
            applicant = User.objects.get(id=application['applicant_user_id'])
            candidate = CandidateProfile.objects.get(user=applicant)
            resume_path = generate_resume(candidate, job.id)
            final_application = {
                "job": job.id,
                "applicant": applicant.id,
                "cover_letter": application['cover_letter'],
                "cv": resume_path,
                "status": "Submitted"
            }
            final_applications.append(final_application)

        final_applications_file_path = os.path.abspath(os.path.join('Back-End/rjb_REST_API/rjb/management/commands/mock_data', 'finalApplications.json'))
        print(f"Writing final applications data to {final_applications_file_path}")
        with open(final_applications_file_path, 'w') as file:
            file.write(json.dumps(final_applications, indent=4))
        print("Final applications data written to finalApplications.json")

        # Now read from finalApplications.json and create Application objects
        with open(final_applications_file_path, 'r') as file:
            applications_data = json.load(file)
        print("Applications data loaded from finalApplications.json")

        for application in applications_data:
            job_id = application['job']
            applicant_id = application['applicant']
            cover_letter = application['cover_letter']
            resume_path = application['cv']
            status = application['status']

            try:
                job_posting = JobPosting.objects.get(id=job_id)
                applicant = User.objects.get(id=applicant_id)
                candidate = CandidateProfile.objects.get(user=applicant)

                # Check if the application already exists
                if not Application.objects.filter(job=job_posting, applicant=applicant).exists():
                    # Save the resume file
                    resume_directory = os.path.join(settings.MEDIA_ROOT, 'jobApplicationResumes', f'{job_posting.employer.user.id}_{job_posting.employer.id}', f'{candidate.user.id}_{candidate.id}', f'{job_posting.id}')
                    os.makedirs(resume_directory, exist_ok=True)
                    resume_path = os.path.join(resume_directory, os.path.basename(resume_path))
                    with open(resume_path, 'wb+') as destination:
                        with open(application['cv'], 'rb') as source:
                            destination.write(source.read())

                    # Create the application
                    Application.objects.create(
                        job=job_posting,
                        applicant=applicant,
                        cover_letter=cover_letter,
                        cv=resume_path,
                        status=status
                    )
                    print(f"Application created for job {job_id} and applicant {applicant_id}")
                else:
                    print(f"Application already exists for job {job_id} and applicant {applicant_id}")

            except JobPosting.DoesNotExist:
                print(f"Job posting {job_id} does not exist")
            except User.DoesNotExist:
                print(f"User {applicant_id} does not exist")
            except CandidateProfile.DoesNotExist:
                print(f"Candidate profile for user {applicant_id} does not exist")
            except Exception as e:
                print(f"Error processing application for job {job_id} and applicant {applicant_id}: {e}")