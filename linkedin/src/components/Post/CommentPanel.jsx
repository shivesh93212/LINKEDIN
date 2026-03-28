import { useState, useEffect } from "react";
import { Send,ArrowLeft } from "lucide-react";
import { addCommentOnPost, getCommentOnPost } from "../../api/commentsApi";
import CommentItem from "./CommentItem";



export default function CommentPanel({ postId, close }) {

  const [comments,setComments] = useState([]);
  const [text,setText] = useState("");
  const [replyTo,setReplyTo]=useState(null)


  const fetchComments = async () => {
    const data = await getCommentOnPost(postId);
 
    setComments(data);
  };

  useEffect(()=>{
    fetchComments();
  },[postId]);

  const handleAdd = async ()=>{
    if(!text.trim()) return;

    await addCommentOnPost(postId,text,replyTo);
    setText("");
    setReplyTo(null)
    fetchComments();
  }
  
  const replyUser = comments.find(c => c.id === replyTo)?.user?.name;

  return (
       <>
     
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50">
        <div className="bg-white w-full max-h-[80vh] rounded-t-2xl flex flex-col">
        {/* comment box */}

        {/* drag bar */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

             {/* backbutton */}
              
              <button
                 onClick={close}
                className="fixed top-23 left-3 text-black-600 font-semibold text-lg mt-2"
                >
                   <ArrowLeft size={21}/>
               </button>


                {/* comments */}
        <div className="flex flex-col gap-2 overflow-y-auto px-4 mt-6">

          {comments
          .filter(c=>!c.parent_id)
          .map(comment=>(
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={comments}
              refresh={fetchComments}
              postId={postId}
              setReplyTo={setReplyTo}
            />
          ))}

        </div>

        {/* input bar */}
        <div className="border-t p-3 flex items-center gap-2">
         
         
          <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            placeholder={replyTo ? `Reply to ${replyUser}...` :"Add a comment..."}
            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
          />
            {replyTo && (
            <button
            onClick={()=>setReplyTo(null)}
            className="font-semibold text-lg text-red-600 mr-1">
              
              ✕
            </button>

            )}
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white p-2 rounded-full"
          >
            <Send size={16}/>
          </button>

        {/* </div> */}
        </div>

      </div>
    </div>
       
    </>
  );
}