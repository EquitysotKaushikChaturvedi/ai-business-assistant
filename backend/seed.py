from app.database import SessionLocal, engine
from app import models, security

models.Base.metadata.create_all(bind=engine)

def seed_user():
    db = SessionLocal()
    email = "admin@example.com"
    password = "Admin@123"
    
    print(f"Password type: {type(password)}")
    print(f"Password length: {len(password)}")

    try:
        # Check if user exists
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            print("Hashing password...")
            hashed_password = security.get_password_hash(password)
            print("Password hashed successfully.")
            new_user = models.User(email=email, hashed_password=hashed_password)
            db.add(new_user)
            db.commit()
            print(f"User created: {email} / {password}")
        else:
            print(f"User already exists: {email}")
            # Optional: Update password if user exists to be sure
            # user.hashed_password = security.get_password_hash(password)
            # db.commit()
            # print("Password updated.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    
    db.close()

if __name__ == "__main__":
    seed_user()
