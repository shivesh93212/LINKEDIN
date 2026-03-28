import React,{useState,useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { getNotificationApi,markAllReadApi } from "../api/notificationApi"
import { ArrowLeft } from "lucide-react"

export default function Notifications(){

 const [notifications,setNotifications]=useState([])
 const navigate=useNavigate()

 useEffect(()=>{

  const fetchData=async()=>{
     const data=await getNotificationApi()
     setNotifications(data)

     await markAllReadApi()
  }

  fetchData()

 },[])

 return(

  <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg mt-6">

   {/* Header */}

   <div className="flex items-center gap-3 p-4 border-b bg-gray-50">

    <button
     onClick={()=>navigate(-1)}
     className="p-1 rounded hover:bg-gray-200"
    >
     <ArrowLeft size={20}/>
    </button>

    <h2 className="text-lg font-semibold">
      Notifications
    </h2>

   </div>


   {/* Notification List */}

   {notifications.length===0 && (
    <p className="text-center text-gray-500 py-6">
      No notifications
    </p>
   )}

   {notifications.map((n)=>(

    <div
     key={n.id}
     onClick={()=>navigate(`/post/${n.reference_id}`)}
     className="flex items-center gap-3 p-4 border-b hover:bg-gray-100 cursor-pointer transition"
    >

     {/* profile image */}

     <img
     src={
        n.actor.profile_photo
        ? n.actor.profile_photo   // Cloudinary URL direct
        : "https://via.placeholder.com/150"  // fallback image
      }
      className="w-10 h-10 rounded-full object-cover border"
     />


     {/* text */}

     <div className="flex flex-col">

       <p className="text-sm">

        <span className="font-semibold">
          {n.actor.name}
        </span>

        {" "} posted something

       </p>

       <p className="text-xs text-gray-500">
         {new Date(n.created_at).toLocaleString()}
       </p>

     </div>

    </div>

   ))}

  </div>

 )

}