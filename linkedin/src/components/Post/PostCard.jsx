import React ,{useState,useEffect,useRef}from "react";
import { deletePost } from "../../api/postApi";
import { getProfileImage } from "../../config";
import { useAuth } from "../../context/AuthContext";
import LikeButton from "../LikeButton"


export default function PostCard({ post, onDelete }) {

  const {user}=useAuth()
  const [open,setOpen]=useState(false)
  const menuRef=useRef()

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

    const currentUserId = localStorage.getItem("user_id") 

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:mt-0">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          
          <img
            src={getProfileImage(post.user?.profile_photo)}
            alt="user"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-gray-900">
              {post.user.name}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        


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

      <p className="mt-3 text-sm text-gray-800">{post.content}</p>

      {post.image_url && (
        <div className="mt-3">
          <img
            src={`http://127.0.0.1:8000/${post.image_url}`}
            alt="post"
            className="rounded-lg w-full"
          />
        </div>
      )}

      <div className="flex justify-between mt-3 text-sm text-gray-600">
        <LikeButton postId={post.id} />
        <button className="hover:text-blue-600">Comment</button>
        <button className="hover:text-blue-600">Repost</button>
        <button className="hover:text-blue-600">Send</button>
      </div>
    </div>
  );
}
