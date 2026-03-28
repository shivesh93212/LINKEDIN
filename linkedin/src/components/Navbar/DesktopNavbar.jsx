import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Home,
  Users,
  BriefcaseBusiness,
  MessageSquareText,
  Bell,
  Grid3X3,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";

import { logoutUser } from "../../utils/auth";
import { getProfileImage } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { searchUserApi } from "../../api/searchApi";
import { useNavigate } from "react-router-dom";
import { getUnreadCountApi } from "../../api/notificationApi";



export default function DesktopNavbar() {

  const {user}=useAuth()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // dropdown open/close state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // settings open/close state
  
  const [count,setCount] = useState(0)

  const dropdownRef = useRef(null); // dropdown container reference
  

  useEffect(()=>{

  const fetchCount = async ()=>{
    try{
      const data = await getUnreadCountApi()
      setCount(data.count)
    }
    catch(err){
      console.log(err)
    }
  }

  fetchCount()

  const interval = setInterval(fetchCount,5000)

  return ()=>clearInterval(interval)

},[])


  useEffect(() => {
    // outside click handle karne ke liye function
    const handleOutsideClick = (e) => {
      // agar click dropdown ke bahar hua
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false); // dropdown close
        setIsSettingsOpen(false); // settings close
      }
    };

    // mousedown event add
    document.addEventListener("mousedown", handleOutsideClick);

    // cleanup function: component unmount hone par remove
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
   

  const [query,setQuery] = useState("")
  const [results,setResults] = useState([])
  const [loading,setLoading] = useState(false)

  const navigate = useNavigate()


  useEffect(()=>{

  if(query.trim()===""){
    setResults([])
    return
  }

  const timer = setTimeout(async()=>{

    try{
      setLoading(true)
      const data = await searchUserApi(query)
      setResults(data)
    }
    catch(err){
      console.log(err)
    }
    finally{
      setLoading(false)
    }

  },300)

  return ()=>clearTimeout(timer)

},[query])


  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 ml-10">
          {/* Left section */}
          <div className="flex items-center justify-between h-14 gap-8">
            <Link
              to="/"
              className="bg-blue-600 text-white font-bold text-2xl px-2 py-1 rounded"
            >
              in
            </Link>

            {/* Search bar */}
            <div className="relative flex items-center bg-[#edf3f8] px-3 py-2 rounded-full w-[120px] sm:w-[200px] md:w-[260px] lg:w-[420px]">
              <Search size={18} className="text-gray-600" />
              <input
               type="text"
               placeholder="Search people"
               value={query}
               onChange={(e)=>setQuery(e.target.value)}
               className="hidden sm:block bg-transparent outline-none px-2 text-sm w-full text-gray-700 placeholder-gray-500"
             />
            </div>

            {loading && (
  <div className="absolute top-12 left-0 w-full bg-white shadow rounded-lg p-3 text-sm z-50">
    Searching...
  </div>
)}

{!loading && results.length>0 && (
  <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto z-50">

    {results.map((user)=>(
      <div
        key={user.id}
        onClick={()=>{
          navigate(`/profile/${user.user_id}`)
          setQuery("")
          setResults([])
        }}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
      >
        <img
          src={user.profile_photo || "https://via.placeholder.com/150"}
          className="w-10 h-10 rounded-full"
        />

        <div>
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500">{user.headline}</p>
        </div>

      </div>
    ))}

  </div>
)}

{!loading && results.length===0 && query && (
  <div className="absolute top-12 left-0 w-full bg-white shadow rounded-lg p-3 text-sm z-50">
    No users found
  </div>
)}
          </div>

          {/* Navbar icons */}
          <nav className="flex items-center gap-4 md:gap-5 lg:gap-8 text-gray-600 whitespace-nowrap">
            <Link
              to="/"
              className="flex flex-col items-center text-xs hover:text-black"
            >
              <Home size={26} />
              <span className="hidden lg:block">Home</span>
            </Link>

            <Link
              to="/network"
              className="flex flex-col items-center text-xs hover:text-black"
            >
              <Users size={26} />
              <span className="hidden lg:block">My Network</span>
            </Link>

            <Link
              to="/jobs"
              className="flex flex-col items-center text-xs hover:text-black"
            >
              <BriefcaseBusiness size={26} />
              <span className="hidden lg:block">Jobs</span>
            </Link>

             

            <Link
              to="/messages"
              className="flex flex-col items-center text-xs hover:text-black"
            >
                <svg xmlns="http://www.w3.org/2000/svg"
       width="26"
       height="26"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2"
       strokeLinecap="round"
       strokeLinejoin="round">

    <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 12 20a8.38 8.38 0 0 1-3.4-.7L3 21l1.7-5.1A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/>

  </svg>
              <span className="hidden lg:block">Messages</span>
            </Link>

            <Link
              to="/notifications"
              className="relative flex flex-col items-center text-xs hover:text-black"
            >
              <Bell size={26} />
              <span className="hidden lg:block">Notifications</span>

              {count > 0 && (
<span className="absolute -top-1 right-2 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
  {count > 99 ? "99+" : count}
</span>
)}
            </Link>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsSettingsOpen(false); 
                }}
                className="flex flex-col items-center text-xs hover:text-black" 
              >
                <img
                  src={user.profile_photo || "https://via.placeholder.com/150"}
                  alt="profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full"

                />

                <div className="flex items-center gap-1">
                  <span>Me</span>
                  <ChevronDown size={14} />
                </div>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {/* Profile link */}
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)} // dropdown close
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View Profile
                  </Link>

                  {/* Settings button */}
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <Settings size={16} />
                      Settings
                    </div>

                    <ChevronDown size={14} />
                  </button>

                  {/* Settings panel */}
                  {isSettingsOpen && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={logoutUser}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Business */}
             {/* Chatbot icon */}
                   <Link to="/chatbot">
                     <button className="text-black  text-lg font-semibold hover:text-gray-500">
                          Ai
                      </button>
                  </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
