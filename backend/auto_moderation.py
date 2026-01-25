from sqlalchemy.orm import Session
from models import Report,Post,User
from moderation_rules import POST_DELETE_LIMIT,USER_BLOCK_LIMIT
from database import get_db
from fastapi import Depends

def run_auto_moderation(
    db: Session,
    post_id: int | None = None,
    user_id: int | None = None
):
    #  POST moderation
    if post_id:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return None

        post.is_deleted = True   # ✅ soft delete
        db.commit()
        return "post_deleted"

    #  USER moderation
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        user.is_active = False   # ✅ block user
        db.commit()
        return "user_blocked"

    return None