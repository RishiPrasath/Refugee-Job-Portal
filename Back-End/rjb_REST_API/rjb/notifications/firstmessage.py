import asyncio
import websockets
import json
from datetime import datetime

async def send_notification(group_name, notification_json):
    uri = f"ws://localhost:8000/ws/notifications/{group_name.split('_')[1]}/"
    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected to WebSocket server for {group_name}.")
            
            # Wait for the connection confirmation message
            confirmation = await websocket.recv()
            print(f"Received confirmation: {confirmation}")
            print(f"Sending notification to {group_name}")




            # Create a test notification
            test_notification = {
                'type': 'notification_message',
                'message': notification_json
            }
            
            await websocket.send(json.dumps(test_notification))
            print(f"Sent: {test_notification}")

            # Receive the response
            response = await websocket.recv()
            print(f"Received: {response}")

    except websockets.exceptions.InvalidStatusCode as e:
        print(f"Failed to connect to WebSocket server: {e}")

async def main():
    # Candidate notification
    candidate_notification_json = {
        'message': "A new interview has been scheduled for your application to Software Engineer position.",
        'recipient': 90,
        'owner': 1,
        'routetopage': "/candidate-upcoming-interviews",
        'created_at': datetime.now().isoformat(),
        'notification_image': "https://example.com/company_logo.jpg"
    }

    # Send candidate notification
    await send_notification("notifications_90", candidate_notification_json)

    # Hiring coordinator notification
    hiring_coordinator_notification_json = {
        'message': "A new interview has been scheduled for John Doe's application to Software Engineer position.",
        'recipient': 25,
        'owner': 1,
        'routetopage': "/candidate-view/123",
        'created_at': datetime.now().isoformat(),
        'notification_image': "https://example.com/company_logo.jpg"
    }

    # Send hiring coordinator notification
    await send_notification("notifications_25", hiring_coordinator_notification_json)

if __name__ == "__main__":
    asyncio.run(main())