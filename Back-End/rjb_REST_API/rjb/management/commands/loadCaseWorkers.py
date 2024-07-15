import json
import os
from django.core.management.base import BaseCommand
from rjb.models import User, CaseWorkerProfile

class Command(BaseCommand):
    help = 'Load case worker data from JSON and create case worker profiles'

    def handle(self, *args, **options):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_file_path = os.path.join(base_dir, 'mock_data', 'mockcaseworkers.json')

        with open(json_file_path, 'r') as file:
            caseworkers = json.load(file)

        for caseworker_data in caseworkers:
            if User.objects.filter(username=caseworker_data['username']).exists() or User.objects.filter(email=caseworker_data['email']).exists():
                print(f"User with username {caseworker_data['username']} or email {caseworker_data['email']} already exists. Skipping.")
                continue

            user = User.objects.create_user(
                username=caseworker_data['username'],
                email=caseworker_data['email'],
                password=caseworker_data['password'],
                role='Case Worker'
            )

            caseworker_profile = CaseWorkerProfile(
                user=user,
                full_name=caseworker_data['full_name']
            )

            user.save()
            caseworker_profile.save()

            print(f"Case worker {caseworker_data['full_name']} registered successfully.")
