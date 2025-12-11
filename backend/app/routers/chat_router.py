from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from .. import crud, database, auth, openai_client, system_prompt, gemini_client, models
import json
from jose import jwt, JWTError

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)

@router.get("/test")
def test_endpoint():
    return {"status": "ok"}

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str, db: Session = Depends(database.get_db)):
    print(f"DEBUG: WebSocket connection attempt. Token: {token[:10]}...")
    await websocket.accept()
    
    # Validate Token
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            print("DEBUG: Token invalid (no email)")
            await websocket.close(code=1008)
            return
        user = crud.get_user_by_email(db, email=email)
        if user is None:
            print("DEBUG: User not found")
            await websocket.close(code=1008)
            return
        print(f"DEBUG: WebSocket authenticated for user: {email}")
    except JWTError as e:
        print(f"DEBUG: JWT Error: {e}")
        await websocket.close(code=1008)
        return

    business = crud.get_business(db, user_id=user.id)
    if not business:
        print("DEBUG: No business profile found")
    else:
        print(f"DEBUG: Business profile found: {business.name}")
    
    try:
        while True:
            data = await websocket.receive_text()
            print(f"DEBUG: Received message: {data}")
            try:
                message_data = json.loads(data)
                user_message = message_data.get("message")
            except json.JSONDecodeError:
                continue

            if not business:
                 # Try to fetch again
                 business = crud.get_business(db, user_id=user.id)
                 if not business:
                    await websocket.send_text(json.dumps({"reply": "Please create a business profile first."}))
                    continue

            # Save User Message
            user_msg_db = models.ChatMessage(user_id=user.id, role="user", content=user_message)
            db.add(user_msg_db)
            db.commit()

            # Retrieve History
            history = db.query(models.ChatMessage).filter(
                models.ChatMessage.user_id == user.id
            ).order_by(models.ChatMessage.id.desc()).limit(10).all()
            
            # Reverse to chronological order
            history = history[::-1]

            sys_prompt = system_prompt.generate_system_prompt(business)
            
            messages = [{"role": "system", "content": sys_prompt}]
            
            # Add history (excluding the one we just saved if it was fetched, checking just in case)
            for msg in history:
                # Gemini expects "model" role for AI, but our DB has "assistant". Map it.
                role = "model" if msg.role == "assistant" else "user"
                # Avoid duplicating the last message if logic overlaps, though here we just saved it.
                # Actually, simpler to just exclude the current one from DB fetch or just append history then current.
                # Let's rely on the list we build.
                if msg.id != user_msg_db.id: # Don't add the message we just added
                     messages.append({"role": role, "content": msg.content})

            # Add current message (Gemini client might expect this explicitly or we can just pass the full list)
            # transform "user" to the correct key if needed by gemini_client. 
            # Looking at gemini_client it likely handles the list. 
            # Only issue: Gemini often requires strict alternation user/model.
            # For now, let's just append the current user message as the last one.
            messages.append({"role": "user", "content": user_message})

            print("DEBUG: Sending request to Gemini...")
            response_text = await gemini_client.get_chat_response(messages)
            print(f"DEBUG: Gemini response: {response_text[:50]}...")
            
            # Save Assistant Response
            ai_msg_db = models.ChatMessage(user_id=user.id, role="assistant", content=response_text)
            db.add(ai_msg_db)
            db.commit()

            await websocket.send_text(json.dumps({"reply": response_text}))

    except WebSocketDisconnect:
        print("DEBUG: WebSocket disconnected")
    except Exception as e:
        print(f"DEBUG: WebSocket Error: {e}")
        import traceback
        traceback.print_exc()
        await websocket.close(code=1011)
