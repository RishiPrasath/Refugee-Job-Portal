from django.http import JsonResponse
from rjb.models import User, ChatGroup, Message
from django.db.models import Q
from rjb.models import *


def get_chats(request, user_id):
    try:
        # Retrieve chat groups where the user is either user1 or user2
        chat_groups = ChatGroup.objects.filter(Q(user1_id=user_id) | Q(user2_id=user_id))
        chats = []
        for chat_group in chat_groups:
            last_message = Message.objects.filter(chat_group=chat_group).order_by('-timestamp').first()
            chats.append({
                'id': chat_group.id,
                'name': f'Chat with {chat_group.user1.username} ({chat_group.user1.role})' if chat_group.user1.id != user_id else f'Chat with {chat_group.user2.username} ({chat_group.user2.role})',
                'lastMessage': last_message.content if last_message else 'No messages yet'
            })
        return JsonResponse(chats, safe=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

def get_messages(request, chat_id, user_id):
    try:
        chat_group = ChatGroup.objects.get(id=chat_id)
        messages = Message.objects.filter(chat_group=chat_group).order_by('timestamp')
        
        # Determine the recipient
        current_user = User.objects.get(id=user_id)
        if chat_group.user1 == current_user:
            recipient = chat_group.user2
        else:
            recipient = chat_group.user1
        
        print("Current user's role: ", current_user.role)
        print("Recipient's role: ", recipient.role)
        
        # Determine the recipient's name based on their role
        if recipient.role == 'Employer':
            try:
                recipient_name = recipient.employerprofile.company_name
            except User.employerprofile.RelatedObjectDoesNotExist:
                recipient_name = "Unknown Company"
        elif recipient.role == 'Hiring Coordinator':
            try:
                recipient_name = recipient.hiringcoordinatorprofile.full_name
            except User.hiringcoordinatorprofile.RelatedObjectDoesNotExist:
                recipient_name = "Unknown Hiring Coordinator"
        elif recipient.role == 'Candidate':
            try:
                recipient_name = recipient.candidateprofile.full_name
            except User.candidateprofile.RelatedObjectDoesNotExist:
                recipient_name = "Unknown Candidate"
        elif recipient.role == 'Case Worker':
            try:
                recipient_name = recipient.caseworkerprofile.full_name
            except User.caseworkerprofile.RelatedObjectDoesNotExist:
                recipient_name = "Unknown Case Worker"
        else:
            recipient_name = recipient.get_full_name()
        
        recipient_role = recipient.role

        print('final full name: ', recipient_name)

        messages_data = {
            'messages': [
                {
                    'messageId': message.id,
                    'content': message.content,
                    'senderId': message.sender.id,
                    'timestamp': message.timestamp.isoformat()
                }
                for message in messages
            ],
            'recipient_name': recipient_name,
            'recipient_role': recipient_role
        }
        return JsonResponse(messages_data, safe=False)
    except ChatGroup.DoesNotExist:
        return JsonResponse({'error': 'Chat group does not exist'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

def get_user_id(request , email):
    # get User id from email    
    try:

        print("email: ",email)

        user = User.objects.get(email=email)
        return JsonResponse({'user_id': user.id}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)


def get_user_id_via_company_name(request, company_name):
    try:
        employer = EmployerProfile.objects.get(company_name=company_name)
        return JsonResponse({'user_id': employer.user.id}, status=200)
    except EmployerProfile.DoesNotExist:
        return JsonResponse({'error': 'Employer does not exist'}, status=404)

def get_or_create_chat(request, user_id_1, user_id_2):
    try:
        # Check if a chat group already exists
        chat_group = ChatGroup.objects.filter(
            (Q(user1_id=user_id_1) & Q(user2_id=user_id_2)) |
            (Q(user1_id=user_id_2) & Q(user2_id=user_id_1))
        ).first()

        if chat_group:
            return JsonResponse({'chat_group_id': chat_group.id}, status=200)
        
        # If not, create a new chat group
        user1 = User.objects.get(id=user_id_1)
        user2 = User.objects.get(id=user_id_2)
        chat_group = ChatGroup.objects.create(user1=user1, user2=user2)
        return JsonResponse({'chat_group_id': chat_group.id}, status=201)
    
    except User.DoesNotExist:
        return JsonResponse({'error': 'One or both users do not exist'}, status=404)