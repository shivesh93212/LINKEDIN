from fastapi import APIRouter,HTTPException
import requests
import os
from dotenv import load_dotenv
load_dotenv()


API_KEY=os.getenv("RAPID_API_KEY")
API_URL="https://jsearch.p.rapidapi.com/search"


router=APIRouter(prefix="/jobs",tags=["jobs"])

@router.get("/search")
def search_jobs(q:str,page:int=1):
    params={
        "query":q,
        "page":page,
        "num_pages":1
    }

    headers={
        "x-rapidapi-key":API_KEY,
        "x-rapidapi-host":"jsearch.p.rapidapi.com"
    }

    try:
        response=requests.get(API_URL,headers=headers,params=params)
        data=response.json()

    except Exception:
        raise HTTPException(500,"Failed to fetch job data")
    
    results=[]

    for job in data.get("data",[]):
        results.append({
            "title": job.get("job_title"),
            "company": job.get("employer_name"),
            "location": job.get("job_city") or job.get("job_country"),
            "source": job.get("job_publisher"),        # LinkedIn / Naukri / Indeed
            "apply_url": job.get("job_apply_link")
        })
    
    return {
        "page":page,
        "count":len(results),
        "results":results
    }