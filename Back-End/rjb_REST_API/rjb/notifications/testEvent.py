import asyncio
import websockets
import json
from datetime import datetime

async def send_event(event_json):
    uri = "ws://localhost:8000/ws/events/"
    
    print(f"Connecting to {uri}")
    
    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected to WebSocket server for events.")
            
            # Wait for the connection confirmation message
            confirmation = await websocket.recv()
            print(f"Received confirmation: {confirmation}")
            print(f"Sending event notification")

            # Send the event JSON with the 'message' field
            await websocket.send(json.dumps({'message': event_json}))
            print(f"Sent: {event_json}")

            # Receive the response
            response = await websocket.recv()
            print(f"Received: {response}")

    except websockets.exceptions.InvalidStatusCode as e:
        print(f"Failed to connect to WebSocket server: {e}")
    except websockets.exceptions.ConnectionClosedError as e:
        print(f"WebSocket connection closed with error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

async def main():
    # Event notification
    event_json = {
        'description': "A new event has been created for the Software Engineer position.",
        'owner': 1,
        'created_at': datetime.now().isoformat(),
        'notification_image': "https://cdn.icon-icons.com/icons2/2496/PNG/512/notification_icon_150299.png"
    }

    # Send event notification
    await send_event(event_json)

if __name__ == "__main__":
    asyncio.run(main())