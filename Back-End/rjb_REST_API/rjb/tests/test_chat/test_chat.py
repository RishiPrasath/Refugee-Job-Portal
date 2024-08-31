from django.test import TestCase, Client
from django.urls import reverse
from rjb.models import User, ChatGroup, Message, EmployerProfile
from django.db.models import Q
from unittest.mock import patch

class ChatViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='testpass', role='Candidate')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='testpass', role='Employer')
        self.chat_group = ChatGroup.objects.create(user1=self.user1, user2=self.user2)
        self.message = Message.objects.create(chat_group=self.chat_group, sender=self.user1, content='Hello')

    def test_get_chats_success(self):
        url = reverse('get_chats', args=[self.user1.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('name', response.json()[0])
        self.assertIn('lastMessage', response.json()[0])

    @patch('rjb.models.ChatGroup.objects.filter')
    def test_get_chats_user_not_found(self, mock_filter):
        mock_filter.side_effect = User.DoesNotExist
        url = reverse('get_chats', args=[999])  # Non-existent user ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User does not exist')

    def test_get_messages_success(self):
        url = reverse('get_messages', args=[self.chat_group.id, self.user1.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('messages', response.json())
        self.assertIn('recipient_name', response.json())
        self.assertIn('recipient_role', response.json())

    def test_get_messages_chat_group_not_found(self):
        url = reverse('get_messages', args=[999, self.user1.id])  # Non-existent chat group ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Chat group does not exist')

    def test_get_messages_user_not_found(self):
        url = reverse('get_messages', args=[self.chat_group.id, 999])  # Non-existent user ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User does not exist')

    def test_get_user_id_success(self):
        url = reverse('get_user_id', args=[self.user1.email])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['user_id'], self.user1.id)

    def test_get_user_id_user_not_found(self):
        url = reverse('get_user_id', args=['nonexistent@example.com'])  # Non-existent email
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User does not exist')

    def test_get_user_id_via_company_name_success(self):
        employer_profile = EmployerProfile.objects.create(user=self.user2, company_name='Test Company')
        url = reverse('get_user_id_via_company_name', args=['Test Company'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['user_id'], self.user2.id)

    def test_get_user_id_via_company_name_not_found(self):
        url = reverse('get_user_id_via_company_name', args=['Nonexistent Company'])  # Non-existent company name
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Employer does not exist')

    def test_get_or_create_chat_existing(self):
        url = reverse('get_or_create_chat', args=[self.user1.id, self.user2.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['chat_group_id'], self.chat_group.id)

    def test_get_or_create_chat_new(self):
        user3 = User.objects.create_user(username='user3', email='user3@example.com', password='testpass', role='Candidate')
        url = reverse('get_or_create_chat', args=[self.user1.id, user3.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 201)
        self.assertIn('chat_group_id', response.json())

    def test_get_or_create_chat_user_not_found(self):
        url = reverse('get_or_create_chat', args=[self.user1.id, 999])  # Non-existent user ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'One or both users do not exist')
