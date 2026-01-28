from fastapi import APIRouter,Depends,HTTPException
from database import get_db
from models import Report
from schemas import ReportCreate,ReportActionResponse
from sqlalchemy.orm import Session
from dependencies import get_current_user
from auto_moderation import run_auto_moderation
from models import Post

router=APIRouter(prefix="/reports",tags=["reports"])

# report user

@router.post("/user/{user_id}",response_model=ReportActionResponse)
def report_user(user_id:int,data:ReportCreate,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    report=Report(
        reporter_id=current_user.id,
        target_user_id=user_id,
        reason=data.reason
    )

    db.add(report)
    db.commit()
    db.refresh(report)
     
    result=run_auto_moderation(db,user_id=user_id)
    
    return report

# report post

@router.post("/post/{post_id}", response_model=ReportActionResponse)
def report_post(
    post_id: int,
    data: ReportCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(404, "Post not found")

    if post.user_id==current_user.id:
        raise HTTPException(400,"You Cannot report your own post")
    
    existing=db.query(Report).filter(
        Report.reporter_id==current_user.id,
        Report.post_id==post_id
    ).first()

    if existing:
        raise HTTPException(400,"You already reported this post")
    
    report = Report(
        reporter_id=current_user.id,
        post_id=post_id,
        reason=data.reason
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    result = run_auto_moderation(db, post_id=post_id)

    return {
        "message": "Post reported successfully",
        "auto_action": result
    }
