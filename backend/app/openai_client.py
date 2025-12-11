import httpx
import os
import json

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

async def get_chat_response(messages: list, model: str = "gpt-3.5-turbo"):
    if not OPENAI_API_KEY:
        return "Error: OPENAI_API_KEY not set."

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": model,
        "messages": messages,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=30.0
            )
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except httpx.HTTPStatusError as e:
            return f"Error from OpenAI: {e.response.text}"
        except Exception as e:
            return f"Error: {str(e)}"
