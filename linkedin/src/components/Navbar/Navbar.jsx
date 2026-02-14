import React from "react"
import DesktopNavbar from "./DesktopNavbar"
import MobileNavbar from "./MobileNavbar"


export default function Navbar(){
    return (
        <>
        
        <div className="hidden md:block">
            <DesktopNavbar/>
        </div>

        <div className="block md:hidden">
            <MobileNavbar/>
        </div>

        </>
    )
}