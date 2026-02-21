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


export default function DesktopNavbar() {

  const {user}=useAuth()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // dropdown open/close state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // settings open/close state

  const dropdownRef = useRef(null); // dropdown container reference

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
            <div className="flex items-center bg-[#edf3f8] px-3 py-2 rounded-full w-[120px] sm:w-[200px] md:w-[260px] lg:w-[420px]">
              <Search size={18} className="text-gray-600" />
              <input
                type="text"
                placeholder="Describe the job you want"
                className="hidden sm:block bg-transparent outline-none px-2 text-sm w-full text-gray-700 placeholder-gray-500"
              />
            </div>
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
              <MessageSquareText size={26} />
              <span className="hidden lg:block">Messages</span>
            </Link>

            <Link
              to="/notifications"
              className="relative flex flex-col items-center text-xs hover:text-black"
            >
              <Bell size={26} />
              <span className="hidden lg:block">Notifications</span>

              <span className="absolute -top-1 right-2 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                13
              </span>
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
                  src={getProfileImage(user?.profile_photo)}
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
            <Link
              to="/business"
              className="flex flex-col items-center text-xs hover:text-black"
            >
              <Grid3X3 size={22} />
              <span className="hidden lg:block">For Business</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
