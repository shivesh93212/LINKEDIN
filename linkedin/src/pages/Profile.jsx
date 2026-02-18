import Rect,{useState} from "react"
import Navbar from "../components/Navbar/Navbar"
import {Settings,LogOut} from "lucide-react"
import { logoutUser } from "../utils/auth"

export default function Profile(){
    const [isSettingsOpen,setIsSettingsOpen]=useState(false)

    return (
        <div className="min-h-screen bg-[#f3f2ef] pb-16 md:pb-0">
            <Navbar/>
            <div className="max-w-3xl mx-auto px-3 sm:px-6 mt-6">
            {/* profile card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* cover photo */}
                <div className="h-24 bg-gray-300"></div>
                    <div className="flex flex-col items-center -mt-10 p-4">
                    <img
                    src="https://i.pravatar.cc/120"
                    alt="profile"
                    className="h-20 w-20 rounded-full border-4"
                    />
                    <h2 className="mt-2 text-lg font-semibold text-gray-900">
                        Shivesh Patel
                    </h2>

                    <p className="text-sm text-gray-600 text-center mt-1">
                        Full Stack Developer |DSA
                    </p>
                    </div>

                    <div className="border-t border-gray-200 p-4">
                        <button
                        onClick={()=>setIsSettingsOpen(!isSettingsOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <Settings size={18}/>
                                Settings
                            </div>
                        </button>
                        {isSettingsOpen && (
                            <button
                            onClick={logoutUser}
                            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 font-semibold hover:bg-red-50"
                            >
                                <LogOut size={18}/>
                                Logout
                            </button>
                        )}
                    </div>
                
            </div>
        </div>
        </div>
    )
}