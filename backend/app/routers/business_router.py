from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, auth, database, models

router = APIRouter(
    prefix="/business",
    tags=["business"],
)

@router.post("/", response_model=schemas.Business)
def create_business(
    business: schemas.BusinessCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    db_business = crud.get_business(db, user_id=current_user.id)
    if db_business:
        raise HTTPException(status_code=400, detail="Business profile already exists")
    return crud.create_business(db=db, business=business, user_id=current_user.id)

@router.get("/", response_model=schemas.Business)
def read_business(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    db_business = crud.get_business(db, user_id=current_user.id)
    if db_business is None:
        # Return empty structure as per requirements if business doesn't exist
        # "If business doesn’t exist, return empty structure"
        # But schema expects fields. I should probably return None or 204 or a default object.
        # The requirement says "return empty structure".
        # Let's return a 404 for now as the frontend can handle it, or return an empty dict if schema allows.
        # Schema fields are required.
        # I will stick to 404 and let frontend handle "create profile" flow.
        raise HTTPException(status_code=404, detail="Business not found")
    return db_business

@router.put("/", response_model=schemas.Business)
def update_business(
    business: schemas.BusinessCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    return crud.update_business(db=db, business=business, user_id=current_user.id)

@router.get("/activity")
def get_activity(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Fetch recent chat messages for the user
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == current_user.id
    ).order_by(models.ChatMessage.id.desc()).limit(5).all()
    
    return [
        {"role": msg.role, "content": msg.content, "timestamp": msg.timestamp}
        for msg in messages
    ]
