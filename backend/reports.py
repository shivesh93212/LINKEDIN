from fastapi import APIRouter,Depends,HTTPException
from database import get_db
from models import Report
from schemas import ReportCreate,ReportResponse
from sqlalchemy.orm import Session
from dependencies import get_current_user


router=APIRouter(prefix="/reports",tags=["reports"])

# report user

@router.post("/user/{user_id}",response_model=ReportResponse)
def report_user(user_id:int,data=ReportCreate,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    report=Report(
        reporter_id=current_user.id,
        target_user_id=user_id,
        reason=data.reason
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report

# report post

@router.post("/post/{post_id}",response_model=ReportResponse)
def report_post(post_id:int,data:ReportCreate,current_user=Depends(get_current_user),db:Session=Depends(get_db)):
    report=Report(
        reporter_id=current_user.id,
        post_id=post_id,
        reason=data.reason
    )
    
    db.add(report)
    db.commit()
    db.refresh(report)


    return report
