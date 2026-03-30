import React ,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  Bell,
  Search,
  BriefcaseBusiness,
  MessageSquareText,
  PlusSquare,
} from "lucide-react";
import CreatePostModel from "../Post/CreatePostModel";
import { useAuth } from "../../context/AuthContext";
import { getProfileImage } from "../../config";
import { searchUserApi } from "../../api/searchApi";
import { useNavigate } from "react-router-dom";
import { getUnreadCountApi } from "../../api/notificationApi";




export default function MobileNavbar() {
  const {user}=useAuth()
  const [isPostOpen,setIsPostOpen]=useState(false)

  const [query,setQuery] = useState("");
  const [results,setResults] = useState([]);
  const [loading,setLoading] = useState(false);
  
  const [count,setCount]=useState(0)

  const navigate=useNavigate()

  useEffect(()=>{

  if(query.trim()===""){
    setResults([]);
    return;
  }


  const timer = setTimeout(async()=>{

    try{
      setLoading(true);
      const data = await searchUserApi(query);
      console.log(data)
      setResults(data);
    }
    catch(err){
      console.error(err);
    }
    finally{
      setLoading(false);
    }

  },300);

  return ()=>clearTimeout(timer);

},[query]);


useEffect(()=>{
    const fetchCount=async()=>{
      const data= await getUnreadCountApi()
      setCount(data.count)
    }
    fetchCount()
    const interval=setInterval(fetchCount,5000)
    return ()=>clearInterval(interval)
  },[])

  return (
    <>
      {/* ✅ Mobile TOP HEADER */}
      <header className="relative w-full bg-gray-600 text-white  top-0 z-50 md:hidden">
        {/* ✅ FIXED: md:hidden so desktop pe show na ho */}
        <div className="flex items-center gap-3 px-3 py-2">
          
          {/* 🔥 NEW: Profile photo clickable */}
          <Link to="/profile">
            {/* ✅ FIXED: profile click -> profile page */}
            <img
              src={user?.profile_photo  || "https://res.cloudinary.com/dlpxi5foo/image/upload/w_150,h_150,c_fill,f_auto,q_auto/dummy_image_nxvwnc"}
              alt="profile"
              className="w-9 h-9 rounded-full border border-gray-500"
            />
          </Link>

          {/* Search bar */}
          <div className=" relative flex items-center bg-[#2d3339] px-3 py-2 rounded-full flex-1">
            <Search size={18} className="text-gray-300" />

            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              className="bg-transparent outline-none px-2 text-sm text-white w-full placeholder-gray-400"
            />
          </div>

          {results.length>0 && (
  <div className="absolute left-0 top-14 w-full bg-white text-black shadow-lg rounded-lg max-h-72 overflow-y-auto z-50">

    {results.map((user)=>(
      <div
        key={user.id}
        onClick={()=>{navigate(`/profile/${user.user_id}`)
                 setQuery("")
                setResults([])
              }}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
      >
        <img
  src={
    user?.profile_photo?.trim()
      ? user.profile_photo
      : "https://res.cloudinary.com/dlpxi5foo/image/upload/w_150,h_150,c_fill,f_auto,q_auto/dummy_image_nxvwnc"
  }
  alt="user"
  onError={(e) => {
    e.currentTarget.onerror = null; // infinite loop se bachata hai
    e.currentTarget.src =
      "https://res.cloudinary.com/dlpxi5foo/image/upload/w_150,h_150,c_fill,f_auto,q_auto/dummy_image_nxvwnc";
  }}
  className="w-10 h-10 rounded-full object-cover"
/>

        <div>
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-gray-500">{user.headline}</p>
        </div>

      </div>
    ))}

  </div>
)}
      {loading && (
            <div className="absolute top-14 w-full bg-white text-black p-3 text-sm">
            Searching...
            </div>
            )}
       {!loading && results.length===0 && query && (
            <div className="absolute top-14 w-full bg-white text-black p-3 text-sm">
            No users found
            </div>
            )}


            {/* Chatbot icon */}
       <Link to="/chatbot">
         <button className="text-gray-50 hover:text-gray-500">
              Ai
          </button>
      </Link>

          {/* Messages icon */}
          <Link to="/messages">
            {/* ✅ FIXED: /message -> /messages */}
            <button className="text-gray-50 hover:text-gray-500 mt-[6px]">
            <svg xmlns="http://www.w3.org/2000/svg"
       width="20"
       height="20"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2"
       strokeLinecap="round"
       strokeLinejoin="round">

    <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 12 20a8.38 8.38 0 0 1-3.4-.7L3 21l1.7-5.1A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/>

  </svg>
  </button>
          </Link>
        </div>
      </header>

      {/* ✅ Mobile BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-600 text-white border-t border-gray-700 z-50 md:hidden">
        {/* ✅ FIXED: md:hidden so desktop pe show na ho */}
        <div className="flex items-center justify-around py-2">
          
          <Link to="/" className="flex flex-col items-center text-[10px]">
            <Home size={22} />
            <span>Home</span>
          </Link>

          <Link to="/network" className="flex flex-col items-center text-[10px]">
            <Users size={22} />
            <span>My Network</span>
          </Link>

          <div> 
          <button
          onClick={()=>setIsPostOpen(true)}
          className="flex flex-col items-center text-[10px]"
          >
            <PlusSquare size={22} />
            <span>Post</span>
          </button>
          <CreatePostModel
          isOpen={isPostOpen}
          onClose={()=>setIsPostOpen(false)}
          onPostCreated={()=>window.location.reload()}
          >
          </CreatePostModel>
         </div>
          <Link
            to="/notifications"
            className="relative flex flex-col items-center text-[10px]"
          >
            <Bell size={22} />
            <span>Notifications</span>

            {/* Notification badge */}
            {count > 0 && (
  <span className="absolute -top-1 right-2 bg-red-600 text-white text-[9px] px-1 rounded-full">
    {count > 99 ? "99+" : count}
  </span>
)}
          </Link>

          <Link to="/jobs" className="flex flex-col items-center text-[10px]">
            <BriefcaseBusiness size={22} />
            <span>Jobs</span>
          </Link>
        </div>
      </footer>
    </>
  );
}
