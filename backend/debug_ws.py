import asyncio
import websockets
import requests
import json

async def test_websocket():
    # 1. Login to get token
    login_url = "http://localhost:8000/auth/token"
    login_data = {"username": "admin@example.com", "password": "Admin@123"}
    
    try:
        print("Logging in...")
        response = requests.post(login_url, data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.status_code} - {response.text}")
            return
        
        token = response.json()["access_token"]
        print(f"Login successful. Token: {token[:10]}...")

        # 1.5 Check HTTP endpoint
        test_url = "http://localhost:8000/chat/test"
        print(f"Checking {test_url}...")
        test_res = requests.get(test_url)
        print(f"HTTP Test: {test_res.status_code} - {test_res.text}")
        
        # 2. Connect to WebSocket
        ws_url = f"ws://localhost:8000/chat/ws?token={token}"
        print(f"Connecting to {ws_url}...")
        
        async with websockets.connect(ws_url) as websocket:
            print("Connected to WebSocket!")
            
            # 3. Send a message
            msg = {"message": "Hello Gemini!"}
            print(f"Sending: {msg}")
            await websocket.send(json.dumps(msg))
            
            # 4. Receive response
            response = await websocket.recv()
            print(f"Received: {response}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket())
