from sqlalchemy.orm import Session
from models import Report, Post, User
from moderation_rules import POST_DELETE_LIMIT, USER_BLOCK_LIMIT

def run_auto_moderation(
    db: Session,
    post_id: int | None = None,
    user_id: int | None = None
):
    # ---------------- POST MODERATION ----------------
    if post_id:
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.is_deleted == False
        ).first()

        if not post:
            return None

        report_count = db.query(Report).filter(
            Report.post_id == post_id
        ).count()

        if report_count >= POST_DELETE_LIMIT:
            post.is_deleted = True   # soft delete
            db.commit()
            return "post_deleted"

        return "post_reported"

    # ---------------- USER MODERATION ----------------
    if user_id:
        user = db.query(User).filter(
            User.id == user_id,
            User.is_active == True
        ).first()

        if not user:
            return None

        report_count = db.query(Report).filter(
            Report.target_user_id == user_id
        ).count()

        if report_count >= USER_BLOCK_LIMIT:
            user.is_active = False   # block user
            db.commit()
            return "user_blocked"

        return "user_reported"

    return None
