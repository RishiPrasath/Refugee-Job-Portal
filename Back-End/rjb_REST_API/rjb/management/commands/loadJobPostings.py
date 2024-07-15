import json
import os
from django.core.management.base import BaseCommand
from rjb.models import EmployerProfile, JobPosting, Skill, JobRequiresSkill

class Command(BaseCommand):
    help = 'Load job postings from JSON file, check employer existence, and create job postings'

    def handle(self, *args, **options):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_file_path = os.path.join(base_dir, 'mock_data', 'mockJobPostings.json')

        with open(json_file_path, 'r') as file:
            job_postings = json.load(file)

        for job in job_postings:
            employer_id = job['employer']
            try:
                employer = EmployerProfile.objects.get(id=employer_id)
                print(f"Employer {employer.company_name} exists.")

                # Create the job posting
                new_job_posting = JobPosting(
                    employer=employer,
                    job_title=job['job_title'],
                    job_description=job['job_description'],
                    requirements=job['requirements'],
                    location=job['location'],
                    compensation_amount=job['compensation_amount'],
                    compensation_type=job['compensation_type'],
                    job_type=job['job_type'],
                    employment_term=job['employment_term'],
                    status=job['status'],
                    ISL=job['ISL']
                )
                new_job_posting.save()

                # Link skills using the JobRequiresSkill intermediate model
                for skill_name in job['skills']:
                    skill, created = Skill.objects.get_or_create(skill_name=skill_name)
                    JobRequiresSkill.objects.create(job=new_job_posting, skill=skill)

                print(f"Job posting for {new_job_posting.job_title} created successfully.")

            except EmployerProfile.DoesNotExist:
                print("Employer does not exist.")