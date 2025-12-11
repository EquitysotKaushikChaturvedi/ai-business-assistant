from app.database import SessionLocal
from app import crud, schemas, models

def debug_create_business():
    db = SessionLocal()
    try:
        # Get user
        user = db.query(models.User).filter(models.User.email == "admin@example.com").first()
        if not user:
            print("User not found")
            return

        print(f"User found: {user.id}")

        # Create business data
        business_data = schemas.BusinessCreate(
            name="Test Business",
            description="Description",
            services="Services",
            address="Address",
            contact="Contact",
            operating_hours="9-5"
        )

        print("Attempting to create business...")
        business = crud.create_business(db, business_data, user.id)
        print(f"Business created: {business.id}")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_create_business()
