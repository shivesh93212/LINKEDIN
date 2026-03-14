import React ,{useState,useEffect,useRef}from "react";
import { deletePost } from "../../api/postApi";
import { getProfileImage } from "../../config";
import { useAuth } from "../../context/AuthContext";
import LikeButton from "../LikeButton"
import {Link,useParams} from "react-router-dom"

export default function PostCard({ post, onDelete }) {

  const {user}=useAuth()
 
  // const Profile=()=>{
  //   const {id}=useParams()
  //   console.log(id)
  // }
  // useEffect(()=>{
  //   const res=await getUserProfile(id)
  // })

  const [open,setOpen]=useState(false)

  const [expanded,setExpanded]=useState(false)
  const [showButton,setShowButton]=useState(false)

  const [selectedImage,setSelectedImage]=useState(null)

  const menuRef=useRef()
  const textRef=useRef()
  
useEffect(()=>{
  const el=textRef.current
  if(el.scrollHeight>el.clientHeight){
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

    if(days>0) return `${days}d ago.`
    if(hours>0) return `${hours}h ago.`
    if(minutes>0) return `${minutes}m ago.`

    return "just now"
  }

    const currentUserId = localStorage.getItem("user_id")

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:mt-0">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link to={`/profile/${post.user.id}`}>
          <img
            src={getProfileImage(post.user?.profile_photo)}
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
           <div className="absolute right-0 mt-2 bg-red-50 shadow-md rounded-md p-2">
           <button
          onClick={()=>{
            if(window.confirm("Delete this post")){
              handleDelete()
            }
          }}
          className="text-sm text-red-600 font-semibold hover:underline"
        >
          Delete
        </button>
        </div>
        )}
      </div>
      </div>
       

       {/* content */}
       <div>
      <p ref={textRef} className={`${expanded? "" : "line-clamp-3"} mt-3 text-sm text-gray-800`}>{post.content}</p>
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
        <div className="mt-3">
          <img
            src={`http://127.0.0.1:8000/${post.image_url}`}
            alt="post"
            className="rounded-lg w-full border border-gray-300 object-cover"
            onClick={()=>setSelectedImage(`http://127.0.0.1:8000/${post.image_url}`)}
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
          <button
          className="absolute top-16 right-5 text-white text-xl"
          >
            ✕
          </button>
          </div>
      )}



      <div className="flex justify-between mt-3 text-sm text-gray-600 border-t border-gray-600 ">
        <LikeButton postId={post.id} />
        <button className="hover:text-blue-600">Comment</button>
        <button className="hover:text-blue-600">Repost</button>
        <button className="hover:text-blue-600">Send</button>
      </div>
    </div>
  );
}
