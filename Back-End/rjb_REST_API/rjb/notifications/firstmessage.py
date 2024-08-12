import asyncio
import websockets
import json

async def send_test_message():
    uri = "ws://localhost:8000/ws/notifications/"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket server.")
            
            # Receive the initial connection message
            response = await websocket.recv()
            print(f"Received: {response}")

            while True:
                message = input("Enter a message to send (or 'exit' to quit): ")
                if message.lower() == 'exit':
                    break

                test_message = {
                    "message": message
                }
                await websocket.send(json.dumps(test_message))
                print(f"Sent: {test_message}")

                response = await websocket.recv()
                print(f"Received: {response}")
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"Failed to connect to WebSocket server: {e}")

if __name__ == "__main__":
    asyncio.run(send_test_message())