import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rjb.models import Message, ChatGroup, User
from asgiref.sync import sync_to_async
from django.dispatch import Signal
from rjb.notifications.signals import message_sent


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket connected to room: {self.room_group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"WebSocket disconnected from room: {self.room_group_name} with close code: {close_code}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(f"Received data: {text_data_json}")  # Log the received data for debugging

        content = text_data_json.get('content')
        sender_id = text_data_json.get('senderId')
        timestamp = text_data_json.get('timestamp')
        chat_group_id = text_data_json.get('chatGroupId')

        if content is not None and sender_id is not None and chat_group_id is not None:
            # Fetch the sender and chat group objects
            sender = await sync_to_async(User.objects.get)(id=sender_id)
            chat_group = await sync_to_async(ChatGroup.objects.get)(id=chat_group_id)

            # Create a new message object
            message = await sync_to_async(Message.objects.create)(
                chat_group=chat_group,
                content=content,
                sender=sender,
                timestamp=timestamp
            )

            # Determine the recipient
            recipient = await sync_to_async(lambda: chat_group.user1 if chat_group.user2.id == sender_id else chat_group.user2)()

            # Trigger the signal
            await message_sent.asend(sender=self.__class__, message=message, sender_user=sender, recipient=recipient)

            # Print the incoming message
            print(f"Received message: {content} from sender: {sender_id} in chat group: {chat_group_id}")

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'content': content,
                    'senderId': sender_id,
                    'timestamp': timestamp,
                    'messageId': message.id,
                    'chatGroupId': chat_group_id
                }
            )
        else:
            print("Invalid message format received")

    async def chat_message(self, event):
        content = event['content']
        sender_id = event['senderId']
        timestamp = event['timestamp']
        message_id = event['messageId']
        chat_group_id = event['chatGroupId']

        await self.send(text_data=json.dumps({
            'messageId': message_id,
            'content': content,
            'senderId': sender_id,
            'timestamp': timestamp,
            'chatGroupId': chat_group_id
        }))