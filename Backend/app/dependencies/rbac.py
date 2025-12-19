from fastapi import Depends, HTTPException, status
from app.dependencies.auth import get_current_user

def require_roles(allowed_roles: list):
    def checker(user=Depends(get_current_user)):
        if user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized"
            )
        return user
    return checker
