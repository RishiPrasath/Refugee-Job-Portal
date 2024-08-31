from rest_framework.decorators import api_view
from rest_framework.response import Response
from rjb.models import Notification, User
from django.shortcuts import get_object_or_404
from django.http import Http404

@api_view(['GET'])
def get_notifications(request):
    username = request.query_params.get('username')
    email = request.query_params.get('email')

    if not username or not email:
        return Response({"error": "Username and email are required."}, status=400)

    try:
        user = User.objects.get(username=username, email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

    notifications = Notification.objects.filter(recipient=user, dismissed=False)
    notification_data = []

    for notification in notifications:
        notification_image = None
        if notification.owner.role == 'Candidate':
            if notification.owner.candidateprofile.profile_picture:
                notification_image = request.build_absolute_uri(notification.owner.candidateprofile.profile_picture.url)
        elif notification.owner.role == 'Employer':
            if notification.owner.employerprofile.logo:
                notification_image = request.build_absolute_uri(notification.owner.employerprofile.logo.url)

        notification_data.append({
            "id": notification.id,
            "description": notification.message,
            "created_at": notification.created_at.isoformat(),
            "notification_image": notification_image,
            "routetopage": notification.routetopage,
        })

    return Response(notification_data)

@api_view(['POST'])
def dismiss_notification(request, notification_id):
    try:
        notification = get_object_or_404(Notification, id=notification_id)
        notification.dismissed = True
        notification.save()
        return Response({"message": "Notification dismissed successfully"})
    except Http404:
        return Response({"error": "Not found."}, status=404)