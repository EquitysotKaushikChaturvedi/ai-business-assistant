from app.database import SessionLocal
from app import models

def list_users():
    db = SessionLocal()
    users = db.query(models.User).all()
    print(f"Total users: {len(users)}")
    for user in users:
        print(f"User: {user.email}, Hash: {user.hashed_password[:10]}...")
    db.close()

if __name__ == "__main__":
    list_users()
