import json
import os
import random
from django.core.management.base import BaseCommand
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from rjb.models import User, EmployerProfile
from django.core.files import File

class Command(BaseCommand):
    help = 'Load employer data from JSON, create and save employer profiles'

    def handle(self, *args, **options):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_file_path = os.path.join(base_dir, 'mock_data', 'mockemployers.json')
        logos_dir_path = os.path.join(base_dir, 'mock_data', 'companylogos')

        print(f"Base directory: {base_dir}")
        print(f"JSON file path: {json_file_path}")
        print(f"Logos directory path: {logos_dir_path}")

        if os.path.exists(logos_dir_path):
            logo_files = [file for file in os.listdir(logos_dir_path) if file.endswith(('.png', '.jpg', '.jpeg'))]
            print("Logo files found:", logo_files)
        else:
            print("Logo directory not found.")
            return

        with open(json_file_path, 'r') as file:
            employers = json.load(file)

        for employer_data in employers:
            if User.objects.filter(username=employer_data['username']).exists() or User.objects.filter(email=employer_data['email']).exists():
                print(f"User with username {employer_data['username']} or email {employer_data['email']} already exists. Skipping.")
                continue

            user = User.objects.create_user(
                username=employer_data['username'],
                email=employer_data['email'],
                password=employer_data['password'],
                role='Employer'  # Set the role for the user
            )

            logo_filename = random.choice(logo_files)
            logo_path = os.path.join(logos_dir_path, logo_filename)

            employer_profile = EmployerProfile(
                user=user,
                company_name=employer_data['company_name'],
                industry=employer_data['industry'],
                contact_phone=employer_data.get('contact_phone', ''),
                location=employer_data['location'],
                website_url=employer_data.get('website', {}).get('url', ''),
                description=employer_data.get('description', '')
            )

            file_path = os.path.join(settings.MEDIA_ROOT, 'logos', f'{user.id}_{employer_profile.id}')
            if not os.path.exists(file_path):
                os.makedirs(file_path)
            fs = FileSystemStorage(location=file_path)
            filename = fs.save(logo_filename, File(open(logo_path, 'rb')))
            employer_profile.logo = os.path.join('logos', f'{user.id}_{employer_profile.id}', filename)

            user.save()
            employer_profile.save()

            print(f"Employer {employer_data['company_name']} registered successfully with logo at {employer_profile.logo}")