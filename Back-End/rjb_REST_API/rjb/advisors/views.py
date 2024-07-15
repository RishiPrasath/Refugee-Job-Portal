from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rjb.models import CandidateProfile, Qualification, WorkExperience
import base64

User = get_user_model()

@api_view(['GET'])
def get_candidate_profile(request):
    email = request.GET.get('email')
    if not email:
        return Response({'error': 'Email parameter is required'}, status=400)
    
    try:
        user = User.objects.get(email=email)
        candidate = CandidateProfile.objects.get(user=user)
        
        # Encode the profile picture in base64
        profile_picture_base64 = None
        if candidate.profile_picture:
            print("file path: ", candidate.profile_picture.path)
            with open(candidate.profile_picture.path, "rb") as image_file:

                

                profile_picture_base64 = base64.b64encode(image_file.read()).decode('utf-8')
        
        profile = {
            'full_name': candidate.full_name,
            'email': candidate.user.email,
            'immigration_status': candidate.immigration_status,
            'accessibility_requirements': candidate.accessibility_requirements,
            'contact_phone': candidate.contact_phone,
            'date_of_birth': candidate.date_of_birth,
            'emergency_contact_name': candidate.emergency_contact_name,
            'emergency_contact_phone': candidate.emergency_contact_phone,
            'linkedin_profile': candidate.linkedin_profile,
            'github_profile': candidate.github_profile,
            'summary': candidate.summary,
            'skills': list(candidate.skills.values()),
            'qualifications': list(Qualification.objects.filter(candidate=candidate).values()),
            'workExperiences': list(WorkExperience.objects.filter(candidate=candidate).values()),
            'profile_picture': profile_picture_base64,
        }
        return Response(profile)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except CandidateProfile.DoesNotExist:
        return Response({'error': 'Candidate profile not found'}, status=404)
    except Exception as e:
        print(f"Error fetching candidate profile: {e}")
        return Response({'error': str(e)}, status=500)

from django.http import JsonResponse
from rjb.models import CandidateProfile, User

def get_assigned_candidates(request):

    

    username = request.GET.get('username')
    email = request.GET.get('email')

    print(username)
    print(email)

    if not username or not email:
        return JsonResponse({'error': 'Username and email are required'}, status=400)

    try:
        user = User.objects.get(username=username, email=email)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

    if hasattr(user, 'caseworkerprofile'):
        case_worker = user.caseworkerprofile
        candidates = CandidateProfile.objects.filter(case_worker=case_worker)
        candidates_data = [
            {
                'full_name': candidate.full_name,
                'email': candidate.user.email,
                'immigration_status': candidate.immigration_status,
                'accessibility_requirements': candidate.accessibility_requirements,
            }
            for candidate in candidates
        ]
        return JsonResponse({'candidates': candidates_data})
    else:
        return JsonResponse({'error': 'User is not a case worker'}, status=403)