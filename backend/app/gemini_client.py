import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

async def get_chat_response(messages: list, model: str = "gemini-2.5-flash"):
    if not GEMINI_API_KEY:
        return "Error: GEMINI_API_KEY not set."

    try:
        # Construct prompt
        system_instruction = ""
        user_message = ""
        
        for msg in messages:
            if msg["role"] == "system":
                system_instruction = msg["content"]
            elif msg["role"] == "user":
                user_message = msg["content"]
        
        full_prompt = f"{system_instruction}\n\nUser: {user_message}"
        
        model_instance = genai.GenerativeModel(model)
        response = await model_instance.generate_content_async(full_prompt)
        
        if response.parts:
             return response.text
        else:
             return "I'm sorry, I couldn't generate a response."
        
    except Exception as e:
        print(f"Gemini Error: {e}")
        return f"Error from Gemini: {str(e)}"
