import React ,{useState} from "react";
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

export default function MobileNavbar() {
  const {user}=useAuth()
  const [isPostOpen,setIsPostOpen]=useState(false)
  return (
    <>
      {/* ✅ Mobile TOP HEADER */}
      <header className="w-full bg-[#1b1f23] text-white sticky top-0 z-50 md:hidden">
        {/* ✅ FIXED: md:hidden so desktop pe show na ho */}
        <div className="flex items-center gap-3 px-3 py-2">
          
          {/* 🔥 NEW: Profile photo clickable */}
          <Link to="/profile">
            {/* ✅ FIXED: profile click -> profile page */}
            <img
              src={getProfileImage(user?.profile_photo)}
              alt="profile"
              className="w-9 h-9 rounded-full border border-gray-500"
            />
          </Link>

          {/* Search bar */}
          <div className="flex items-center bg-[#2d3339] px-3 py-2 rounded-full flex-1">
            <Search size={18} className="text-gray-300" />

            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none px-2 text-sm text-white w-full placeholder-gray-400"
            />
          </div>

          {/* Messages icon */}
          <Link to="/messages">
            {/* ✅ FIXED: /message -> /messages */}
            <MessageSquareText size={22} className="text-gray-200" />
          </Link>
        </div>
      </header>

      {/* ✅ Mobile BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#1b1f23] text-white border-t border-gray-700 z-50 md:hidden">
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
            <span className="absolute -top-1 right-2 bg-red-600 text-white text-[9px] px-1 rounded-full">
              13
            </span>
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
