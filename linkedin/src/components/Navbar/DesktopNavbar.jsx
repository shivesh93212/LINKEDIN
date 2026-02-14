import React from "react"
import {Link} from "react-router-dom"
import{Search,Home,Users,BriefcaseBusiness,MessageSquareText,Bell,Grid3X3,} from "lucide-react"


export default function DesktopNavbar(){
    return (
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
           <div className="max-w-6xl mx-auto px-4">


            <div className="flex items-center justify-between h-14 ml-10">
                <div className="flex items-center justify-between h-14 gap-8 ">
                    <Link
                    to="/"
                    className="bg-blue-600 text-white font-bold text-2xl px-2 py-1 rounded"
                    >
                        in
                    </Link>

                    <div className="flex items-center bg-[#edf3f8] px-4 py-2 rounded-full w-[320px]">
                        <Search size={18} className="text-gray-600"/>
                        <input
                        type='text'
                        placeholder="Describe the job you want"
                        className="bg-transparent outline-none px-2 text-sm w-full text-gray-700 placeholder-gray-500"
                        />
                    </div>
                </div>

            <nav className="flex items-center gap-8 text-gray-600">
                <Link
                to="/"
                className="flex flex-col items-center text-xs hover:text-black"
                >
                    <Home size={26}/>
                     <span>Home</span>
                </Link>

                <Link
                to="/network"
                className="flex flex-col items-center text-xs hover:text-black"
                
                >
                    
                    <Users size={26}/>
                     <span>My Network</span>
                </Link>

                <Link
                to="/jobs"
                className="flex flex-col items-center text-xs hover:text-black"
                >
                    <BriefcaseBusiness size={26}/>
                    <span>Jobs</span>
                </Link>

                <Link
                to="/messages"
                className="flex flex-col items-center text-xs hover:text-black"
                >
                    <MessageSquareText size={26}/>
                     <span>Messages</span>
                </Link>

                <Link
                to="/notifications"
                className="relative flex flex-col items-center text-xs hover:text-black"
                >
                    <Bell size={26} />
                    <span>Notifications</span>
                    <span className="absolute -top-1 right-2 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                        13
                    </span>
                </Link>

                <Link
                to="/profile"
                className="flex flex-col items-center text-xs hover:text-black"
                >
                    <img
                    src="https://i.pravatar.cc/40"
                    alt="profile"
                    className="w-9 h-9 rounded-full"
                    />
                    <span>Me</span>
                </Link>

            </nav>
            </div>
           </div>
        </header>
    )
}