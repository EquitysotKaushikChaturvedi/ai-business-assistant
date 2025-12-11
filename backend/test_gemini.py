import asyncio
from app import gemini_client
import os
from dotenv import load_dotenv

load_dotenv()

async def test_gemini():
    print(f"API Key present: {bool(os.getenv('GEMINI_API_KEY'))}")
    messages = [{"role": "user", "content": "Hello, are you working?"}]
    response = await gemini_client.get_chat_response(messages)
    print(f"Response: {response}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
