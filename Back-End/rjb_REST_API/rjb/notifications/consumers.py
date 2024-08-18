import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'notifications_{self.user_id}'

        # Join the group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        # Send a message to the WebSocket client upon successful connection
        await self.send(text_data=json.dumps({
            'message': 'Connection established successfully'
        }))

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # Print the received message
        print(f"Received message: {message}")

        # Send message to the group
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'notification_message',
                'message': message
            }
        )

    async def notification_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

class EventConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'events'

        # Join the group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        # Send a message to the WebSocket client upon successful connection
        await self.send(text_data=json.dumps({
            'message': 'Connection established successfully'
        }))

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # Print the received message
        print(f"Received message: {message}")

        # Send message to the group
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'event_message',
                'message': message
            }
        )

    async def event_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))