from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from .. import crud, schemas, auth, database, security

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    print(f"DEBUG: Login attempt for username: {form_data.username}")
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user:
        print("DEBUG: User not found in DB")
    else:
        print(f"DEBUG: User found. ID: {user.id}, Hash start: {user.hashed_password[:10]}...")
        is_valid = security.verify_password(form_data.password, user.hashed_password)
        print(f"DEBUG: Password verification result: {is_valid}")
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Generate Correlation ID
    import uuid
    correlation_id = str(uuid.uuid4())
    
    from fastapi.responses import JSONResponse
    content = {"access_token": access_token, "token_type": "bearer"}
    return JSONResponse(content=content, headers={"X-Correlation-ID": correlation_id})
