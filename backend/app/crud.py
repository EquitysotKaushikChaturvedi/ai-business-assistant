from sqlalchemy.orm import Session
from . import models, schemas, security

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_business(db: Session, user_id: int):
    return db.query(models.Business).filter(models.Business.user_id == user_id).first()

def create_business(db: Session, business: schemas.BusinessCreate, user_id: int):
    db_business = models.Business(**business.dict(), user_id=user_id)
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business

def update_business(db: Session, business: schemas.BusinessCreate, user_id: int):
    db_business = get_business(db, user_id)
    if db_business:
        db_business.name = business.name
        db_business.description = business.description
        db_business.services = business.services
        db_business.address = business.address
        db_business.contact = business.contact
        db_business.operating_hours = business.operating_hours
        db.commit()
        db.refresh(db_business)
    return db_business
