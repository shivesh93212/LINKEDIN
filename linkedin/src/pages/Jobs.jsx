import React,{useState} from "react";
import { jobApi } from "../api/jobApi";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
 
const [query,setQuery]=useState("")
const [jobs,setJobs]=useState([])
const [loading,setLoading]=useState(false)
const [hasSearched, setHasSearched] = useState(false);

const navigate = useNavigate()

const handleSearch=async()=>{
  if(!query.trim()) return
  setHasSearched(true)
  setLoading(true)
  setJobs([])

     let isTimeOut=false;
     const timeout=setTimeout(()=>{
       isTimeOut=true
       setLoading(false)
     },7000)

  try{
    const data = await jobApi(query)
    if(!isTimeOut){
    setJobs(data.results || [])
    setLoading(false)
    clearTimeout(timeout)
  }
}
  catch(err){
     console.log(err)
     clearTimeout(timeout)
     setLoading(false)
  }

 
}

  return ( 
    <div>

       {/* back button */}

      <div className="flex items-center gap-3 bg-gray-700 text-white p-3 shadow">

  <button
    onClick={()=>navigate(-1)}
    className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
  >
    ←
  </button>

  <h2 className="font-semibold text-lg">
    Jobs
  </h2>

</div>

       {/* search bar */}

       <div>
        <input
        type="text"
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        onKeyDown={(e)=>{
          if(e.key==="Enter") handleSearch()
        }}
        placeholder="Search Jobs..."
        className="border border-gray-600 rounded-full p-1 m-4 ml-2 pl-3"
        />

        <button
         onClick={handleSearch}
         disabled={loading || !query.trim()}
         className="bg-blue-600 rounded-full text-gray-200  p-1 pl-3 pr-3 font-semibold hover:bg-blue-700">
          {loading ? "Searching..." : "Search"}
        </button>
       </div>

       {/* searching */}

       {loading &&(
        <p className="ml-4 text-blue-600 font-semibold">
          Searching jobs...
        </p>
       )}

       {/* no jobs */}

       {!loading && jobs.length===0 && query && hasSearched &&(
        <p className="ml-4 text-red-500 font-semibold">
          No jobs found or server is slow. Try again.
        </p>
       )}

       {/* job list */}
       
       { !loading && jobs.map((job,index)=>(
        <div key={index} className="border p-3 m-3 rounded">

          <h3>{job.title}</h3>

          <p>{job.company} • {job.location}</p>

          <p>Source: {job.source}</p>

          <a
            href={job.apply_url}
            target="_blank"
            rel="noreferrer"
            className="bg-green-600 rounded-full text-white p-1 pl-3 pr-3 ml-40 font-semibold border border-gray-600"
          >
            Apply
          </a>

        </div>
       ))}

    </div>
  )
}