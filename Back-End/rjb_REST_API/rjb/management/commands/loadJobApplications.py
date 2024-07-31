import json
import os
from django.core.management.base import BaseCommand
from django.core.serializers import serialize
from rjb.models import CandidateProfile, EmployerProfile, JobPosting

class Command(BaseCommand):
    help = 'Load job applications from JSON file and print candidates, employers, and job postings'

    def handle(self, *args, **options):
        # Directory to save JSON files
        output_dir = 'newSampleData'
        os.makedirs(output_dir, exist_ok=True)

        # Get and write all candidates to JSON file
        candidates = CandidateProfile.objects.all()
        candidates_json = serialize('json', candidates)
        candidates_file_path = os.path.abspath(os.path.join(output_dir, 'candidates.json'))
        print(f"Writing candidates data to {candidates_file_path}")
        with open(candidates_file_path, 'w') as file:
            file.write(json.dumps(json.loads(candidates_json), indent=4))
        print("Candidates data written to candidates.json")

        # Get and write all employers to JSON file
        employers = EmployerProfile.objects.all()
        employers_json = serialize('json', employers)
        employers_file_path = os.path.abspath(os.path.join(output_dir, 'employers.json'))
        print(f"Writing employers data to {employers_file_path}")
        with open(employers_file_path, 'w') as file:
            file.write(json.dumps(json.loads(employers_json), indent=4))
        print("Employers data written to employers.json")

        # Get and write all job postings to JSON file
        job_postings = JobPosting.objects.all()
        job_postings_json = serialize('json', job_postings)
        job_postings_file_path = os.path.abspath(os.path.join(output_dir, 'job_postings.json'))
        print(f"Writing job postings data to {job_postings_file_path}")
        with open(job_postings_file_path, 'w') as file:
            file.write(json.dumps(json.loads(job_postings_json), indent=4))
        print("Job postings data written to job_postings.json")