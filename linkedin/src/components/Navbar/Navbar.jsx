import React from "react"
import {Link} from "react-router-dom"
import{Search,Home,Users,BriefcaseBusiness,MessageSquareText,Bell,User,} from "lucide-react"


export default function Navbar(){
    return (
        <header>
            <div>
                <div>
                    <div>
                        <Link to="/">
                        in
                        </Link>

                        <div>
                            <Search size={18}/>
                                <input 
                                type="text"
                                placeholder="Search"
                                />
                            
                        </div>
                    </div>

                    <nav>
                        <Link to="/">
                        <Home size={20}/>
                        <span>Home</span>
                        </Link>

                        <Link
                        to="/network"
                        >
                            <Users size={20}/>
                            <span>My Network</span>
                        </Link>

                        <Link
                        to="/jobs"
                        >
                            <BriefcaseBusiness size={20}/>
                            <span>jobs</span>
                        </Link>

                        <Link
                        to="/message"
                        >
                            <MessageSquareText size={20}/>
                            <span>Messaging</span>
                        </Link>

                        <Link
                        to="/notofications"
                        >
                            <Bell size={20} />
                            <span>Notifications</span>
                        </Link>

                        <Link
                        to="/profile"
                        >
                            <user size={20} />
                            <span>Me</span>
                        </Link>
                    </nav>
                </div>

                <div>
                    <div>
                        <Search size={18}/>
                        <input
                        type="text"
                        placeholder="Search"
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}