import React, { useState } from "react";
import { addCommentOnPost, deleteOwnComment } from "../../api/commentsApi";
import { getProfileImage } from "../../config";
import { Link } from "react-router-dom";


export default function CommentItem({
  comment,
  allComments,
  refresh,
  postId,
  setReplyTo
}) {


  const replies = allComments.filter((c) => c.parent_id === comment.id);


  const handleDelete = async () => {
    if (!window.confirm("Delete comment?")) return;

    await deleteOwnComment(comment.id);
    refresh();
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

  const currentUserId=localStorage.getItem("user_id")


  return (
    <div className="text-sm">

      {/* comment */}
      <div className="flex gap-3 items-start">

        {/* profile image */}
         <Link to={`/profile/${comment.user.id}`}>
        <img
          src={comment.user?.profile?.profile_photo || "https://via.placeholder.com/150" }
          className="w-9 h-9 rounded-full mt-2"
          alt="user"
        />
             </Link>

        <div className="flex-1">

          {/* name + skills */}
          <div className="rounded-lg px-3 py-2">
            <div className="flex">
          <Link to={`/profile/${comment.user.id}`}>
          
            <p className="font-semibold text-[13px]">
              {comment.user?.name} 
            </p>
          </Link>

          <p className="text-[10px] text-gray-400 mt-[2px] ml-8">
              {getTimeAgo(comment.created_at)}
            </p>

            </div>
            
            <Link to={`/profile/${comment.user.id}`}>
            <p className="text-[11px] text-gray-500">
              {comment.user?.profile?.skills.slice(0,13)}...
            </p>
            </Link>
            

            <p className="text-gray-800 mt-1">
              {comment.content}
            </p>

          </div>

          {/* actions */}
          <div className="flex gap-3 mt-1 text-xs">
           
            <button
              onClick={()=>setReplyTo(comment.id)}
              className=" text-gray-600 px-2 rounded text-xs font-semibold hover:text-gray-800"
            >
              Reply

            </button>

           {String(comment.user.id)==currentUserId && (

            <button
              onClick={handleDelete}
              className="text-red-500 font-semibold hover:underline"
            >
              Delete
            </button>

           )}
          </div>

         

        </div>
      </div>

      {/* replies */}
      {replies.length > 0 && (
        <div className="ml-10 mt-2 space-y-2 border-l pl-3">
          {replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              allComments={allComments}
              refresh={refresh}
              postId={postId}
              setReplyTo={setReplyTo}
              
            />
          ))}
        </div>
      )}

    </div>
  );
}