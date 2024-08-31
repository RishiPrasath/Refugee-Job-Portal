from django.test import TestCase, Client
from django.urls import reverse
from rjb.models import User, Notification, CandidateProfile, EmployerProfile
from rest_framework import status

class NotificationViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass', role='Candidate')
        self.candidate_profile = CandidateProfile.objects.create(user=self.user, full_name='Test Candidate')
        self.employer = User.objects.create_user(username='employer', email='employer@example.com', password='testpass', role='Employer')
        self.employer_profile = EmployerProfile.objects.create(user=self.employer, company_name='Test Company')
        self.notification = Notification.objects.create(message='Test Notification', recipient=self.user, owner=self.employer)

    def test_get_notifications_success(self):
        url = reverse('get_notifications')
        response = self.client.get(url, {'username': 'testuser', 'email': 'testuser@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('description', response.json()[0])
        self.assertIn('created_at', response.json()[0])
        self.assertIn('notification_image', response.json()[0])
        self.assertIn('routetopage', response.json()[0])

    def test_get_notifications_missing_parameters(self):
        url = reverse('get_notifications')
        response = self.client.get(url, {'username': 'testuser'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'Username and email are required.')

    def test_get_notifications_user_not_found(self):
        url = reverse('get_notifications')
        response = self.client.get(url, {'username': 'nonexistent', 'email': 'nonexistent@example.com'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json()['error'], 'User not found.')

    def test_dismiss_notification_success(self):
        url = reverse('dismiss_notification', args=[self.notification.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['message'], 'Notification dismissed successfully')
        self.notification.refresh_from_db()
        self.assertTrue(self.notification.dismissed)

    def test_dismiss_notification_not_found(self):
        url = reverse('dismiss_notification', args=[999])  # Non-existent notification ID
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json()['error'], 'Not found.')
