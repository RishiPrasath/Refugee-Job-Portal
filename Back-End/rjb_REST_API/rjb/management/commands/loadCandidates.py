import json
import os
import random
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from rjb.models import User, CandidateProfile, CaseWorkerProfile, Skill, WorkExperience, Qualification

class Command(BaseCommand):
    help = 'Simulate and execute candidate registration process'

    def handle(self, *args, **options):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_file_path = os.path.join(base_dir, 'mock_data', 'mockCandidates.json')

        with open(json_file_path, 'r') as file:
            candidates = json.load(file)

        profile_pic_dir = os.path.join(base_dir, 'mock_data', 'profilepic')
        if not os.path.exists(profile_pic_dir) or not os.path.isdir(profile_pic_dir):
            print("Profile picture directory does not exist or is not a directory.")
            return

        for candidate_data in candidates:
            if User.objects.filter(username=candidate_data['username']).exists():
                print(f"A user with username {candidate_data['username']} already exists")
                continue
            if User.objects.filter(email=candidate_data['email']).exists():
                print(f"A user with email {candidate_data['email']} already exists")
                continue

            user = User.objects.create_user(
                username=candidate_data['username'],
                password=candidate_data['password'],
                email=candidate_data['email'],
                role=candidate_data['role']
            )

            case_workers = list(CaseWorkerProfile.objects.all())
            if not case_workers:
                print("No case workers available")
                continue

            case_worker = random.choice(case_workers)

            candidate_profile = CandidateProfile.objects.create(
                user=user,
                full_name=candidate_data['full_name'],
                date_of_birth=candidate_data.get('date_of_birth'),
                contact_phone=candidate_data.get('contact_phone'),
                emergency_contact_name=candidate_data.get('emergency_contact_name'),
                emergency_contact_phone=candidate_data.get('emergency_contact_phone'),
                linkedin_profile=candidate_data.get('linkedin_profile'),
                github_profile=candidate_data.get('github_profile'),
                summary=candidate_data.get('summary'),
                accessibility_requirements=candidate_data.get('accessibility_requirements'),
                immigration_status=candidate_data.get('immigration_status'),
                case_worker=case_worker
            )

            # Handle skills
            if 'skills' in candidate_data:
                skills = candidate_data['skills']
                for skill_name in skills:
                    skill, created = Skill.objects.get_or_create(skill_name=skill_name.strip())
                    candidate_profile.skills.add(skill)

            # Handle profile picture based on gender
            gender = candidate_data.get('gender', 'not specified').lower()
            if gender == 'male':
                placeholder_image = 'male-profile-placeholder.jpg'
            elif gender == 'female':
                placeholder_image = 'female-profile-placeholder.jpg'
            else:
                placeholder_image = 'default-placeholder.jpg'  # Use a generic placeholder if gender is not specified or recognized

            profile_pic_path = os.path.join(profile_pic_dir, placeholder_image)
            if not os.path.exists(profile_pic_path):
                print(f"Profile picture not found for gender {gender}. Using generic placeholder.")
                placeholder_image = 'generic-placeholder.jpg'  # Ensure this file exists in the profilepic directory
                profile_pic_path = os.path.join(profile_pic_dir, placeholder_image)

            file_path = os.path.join(settings.MEDIA_ROOT, 'profile_pictures', f'{user.id}_{candidate_profile.id}')
            if not os.path.exists(file_path):
                os.makedirs(file_path)
            fs = FileSystemStorage(location=file_path)
            with open(profile_pic_path, 'rb') as file:
                filename = fs.save(placeholder_image, file)

            candidate_profile.profile_picture = os.path.join('profile_pictures', f'{user.id}_{candidate_profile.id}', filename)
            candidate_profile.save()

            # Handle qualifications
            if 'qualifications' in candidate_data:
                for qualification in candidate_data['qualifications']:
                    Qualification.objects.create(
                        school=qualification['school'],
                        qualification=qualification['qualification'],
                        start_year=qualification['start_year'],
                        end_year=qualification['end_year'],
                        candidate=candidate_profile
                    )

            # Handle work experiences
            if 'workExperiences' in candidate_data:
                for work_experience in candidate_data['workExperiences']:
                    work_exp = WorkExperience.objects.create(
                        company=work_experience['company'],
                        role=work_experience['role'],
                        start_year=work_experience['startYear'],
                        end_year=work_experience['endYear'],
                        description=work_experience.get('description', ''),
                        candidate=candidate_profile
                    )
                    if 'skills' in work_experience:
                        for skill_name in work_experience['skills']:
                            skill, created = Skill.objects.get_or_create(skill_name=skill_name.strip())
                            work_exp.skills.add(skill)

            print(f"User {user.username} registered successfully with role {user.role}.")

        print("All candidates processed.")