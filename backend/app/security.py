from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    try:
        result = pwd_context.verify(plain_password, hashed_password)
        print(f"DEBUG: pwd_context.verify result: {result}")
        return result
    except Exception as e:
        print(f"DEBUG: pwd_context.verify ERROR: {e}")
        return False

def get_password_hash(password):
    return pwd_context.hash(password)
