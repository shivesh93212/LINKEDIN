import React ,{useState,useEffect,useRef}from "react";
import { deletePost } from "../../api/postApi";
import { getProfileImage } from "../../config";
import { useAuth } from "../../context/AuthContext";
import LikeButton from "../LikeButton"
import {Link,useParams} from "react-router-dom"

import SendButton from "./SendButton";
import CommentPanel from "./CommentPanel";
import { MessageCircle } from "lucide-react";

import { reportPost } from "../../api/reportApi";
import axios from "axios"


export default function PostCard({ post, onDelete }) {

  const {user}=useAuth()
 
  const [showComments,setShowComments]=useState(false)
  
  const [open,setOpen]=useState(false)

  const [expanded,setExpanded]=useState(false)
  const [showButton,setShowButton]=useState(false)

  const [selectedImage,setSelectedImage]=useState(null)

  const menuRef=useRef()
  const textRef=useRef()
  
useEffect(()=>{
  const el=textRef.current
  if(el && el.scrollHeight>el.clientHeight){
    setShowButton(true)
  }
},[])

  useEffect(()=>{
    const handleClickOutside=(event)=>{
      if(menuRef.current && !menuRef.current.contains(event.target)){
        setOpen(false)
      }
    }
    document.addEventListener("mousedown",handleClickOutside)

    return ()=>{
      document.removeEventListener("mousedown",handleClickOutside)
    }
  },[])


  const handleDelete = async () => {
   
    try {
      await deletePost(post.id);
      onDelete(post.id);
      
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed!");
    }

  };

  const getTimeAgo =(date)=>{
    const now =new Date()
    const postTime=new Date(date)

    const diff=Math.floor((now-postTime)/1000)

    const hours=Math.floor(diff/3600)
    const days=Math.floor(diff/86400)
    const minutes=Math.floor(diff/60)

    if(days>0) return `${days}d ago`
    if(hours>0) return `${hours}h ago`
    if(minutes>0) return `${minutes}m ago`

    return "just now"
  }

  const handleReport=async()=>{
    try{
      const res=await reportPost(post.id,"Spam")
    }
    catch(err){
        // alert(res.message)
        alert(err.response.data.detail)
    }
  }

  const [shareOpen,setShareOpen]=useState(false)
  const [chatUsers,setChatUsers]=useState([])
  const [selectedUser,setSelectedUser]=useState(null)



  const fetchChats=async()=>{
  try{
    const token=localStorage.getItem("token")

    const res=await axios.get(" https://prolinker-pqo7.onrender.com/chat/list",{
      headers:{Authorization:`Bearer ${token}`}
    })

    setChatUsers(res.data)
  }catch(err){
    console.log(err)
  }
}

const sendShare=async()=>{
  try{

    if(!selectedUser){
      alert("Select a user first")
      return
    }

    const token=localStorage.getItem("token")

    await axios.post("https://prolinker-pqo7.onrender.com/chat/send",
    {
      receiver_id:selectedUser,
      content:`[POST_SHARE]${post.id}`
    },
    {
      headers:{Authorization:`Bearer ${token}`}
    })

    setShareOpen(false)
    setSelectedUser(null)

  }catch(err){
    console.log(err)
  }
}
  const currentUserId = localStorage.getItem("user_id")

  return (
    <>
    <div className="bg-white rounded-xl border border-gray-200 p-3 md:mt-0">

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link to={`/profile/${post.user.id}`}>
          <img
            src={post.user?.profile_photo}
            alt="user"
            className="w-12 h-12 rounded-full"
          />
          </Link>

          <div>
          <Link to={`/profile/${post.user.id}`}>
            <h3 className="font-semibold text-gray-900">
              {post.user.name}
            </h3>
            </Link>
           
           <Link to={`/profile/${post.user.id}`}>
            <p className="text-[12px] font-semibold text-gray-600">
              {post.user?.skills?.slice(0,13)}...
              </p>
              </Link>

            <p className="text-xs text-gray-400 mt-1">
              {getTimeAgo(post.created_at)}
            </p>
          </div>
        </div>

        {/* delete post button */}
        <div ref={menuRef} className="relative">
          <div
           onClick={()=>setOpen(!open)}
           className="cursor-pointer text-xl font-bold"
           >
              ⋮
          </div>
          {open && String(post.user.id)===currentUserId &&(
           <div className="absolute right-0 mt-2 bg-gray-400 shadow-md rounded-md pl-6 pr-2 pt-2 pb-2  flex ">
           <button
          onClick={()=>{
            if(window.confirm("Delete this post")){
              handleDelete()
            }
          }}
          className="text-[11px] text-black-600 font-semibold hover:underline whitespace-nowrap"
        >
          Delete Post
        </button>
        
        </div>
        )}
         
        {open && String(post.user.id)!==currentUserId &&(
           <div className="absolute right-0 mt-2 bg-gray-400 shadow-md rounded-md pl-6 pr-2 pt-2 pb-2  flex ">
           <button
          onClick={()=>{
            if(window.confirm("Report this post")){
              handleReport()
            }
          }}
          className="text-[11px] text-black-600 font-semibold hover:underline whitespace-nowrap"
        >
          Report Post
        </button>
        </div>
        )}

      </div>
      </div>

      {/* content */}
      <div>
      <p ref={textRef} className={`${expanded? "" : "line-clamp-3"} mt-3 text-sm text-gray-800`}>
        {post.content}
      </p>

      {showButton && (
      <button
      onClick={()=>setExpanded(!expanded)}
      className="text-gray-600 text-sm font-semibold"
      >
        {expanded? "less..." : "...more"}
      </button>
      )}
      </div>

      {post.image_url && (
        <div className="mt-3 w-full overflow-hidden rounded-lg">
          <img
            src={post.image_url}
            alt="post"
            className="rounded-lg w-full border border-gray-300 object-cover"
            onClick={()=>setSelectedImage(post.image_url)}
          />
        </div>
      )}

      {selectedImage &&(
        <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        onClick={()=> setSelectedImage(null)}
        >
          <img
          src={selectedImage}
          alt="full view"
          className="max-h-[90%] max-w-[90%] rounded-lg transition-transform duration-300"
          />
        </div>
      )}

      {/* action buttons */}
      <div className="flex justify-between mt-3 text-sm text-gray-600 border-t border-gray-600">

        <LikeButton postId={post.id} />

        {/* comment button */}
       <button
        onClick={()=>setShowComments(true)}
         className="flex flex-col items-center hover:text-blue-600 mt-[14px] font-semibold"
          >
             <MessageCircle size={14}/>
            <span className="text-xs mt-[7px]">Comment</span>
             </button>

        <SendButton onClick={()=>{
  setShareOpen(true)
  fetchChats()
}}/>

      </div>
    </div>

    {/* comment panel */}
    {showComments && (
      <CommentPanel
        postId={post.id}
        close={()=>setShowComments(false)}
      />
    )}

    {shareOpen && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white w-96 rounded-xl p-4">

<div className="flex justify-between mb-3">
<h2 className="font-semibold">Share Post</h2>

<button
onClick={()=>setShareOpen(false)}
>
✕
</button>

</div>

<div className="max-h-60 overflow-y-auto space-y-2">

{chatUsers.map(user=>(
<div
key={user.user_id}
onClick={()=>setSelectedUser(user.user_id)}
className={`flex items-center gap-3 p-2 rounded cursor-pointer
${selectedUser===user.user_id ? "bg-blue-100":"hover:bg-gray-100"}`}
>

<img
src={user.profile_photo}
className="w-10 h-10 rounded-full"
/>

<span>{user.name}</span>

</div>
))}

</div>

<button
onClick={sendShare}
className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg"
>
Send
</button>

</div>

</div>
)}

    </>
  );
}