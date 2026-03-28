import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addCommentOnPost, getCommentOnPost } from "../api/commentsApi";
import CommentItem from "../components/Post/CommentItem";

export default function CommentsPage() {

  const { postId } = useParams();

  const [comments,setComments] = useState([]);
  const [text,setText] = useState("");

  const fetchComments = async ()=>{
    const data = await getCommentOnPost(postId);
    setComments(data);
  };

  useEffect(()=>{
    fetchComments();
  },[postId]);

  const handleAdd = async ()=>{
    if(!text.trim()) return;

    await addCommentOnPost(postId,text);
    setText("");
    fetchComments();
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-4">

      <h2 className="text-lg font-semibold mb-4">
        Comments
      </h2>

      {/* add comment */}
      <div className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border px-3 py-2 rounded"
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Post
        </button>
      </div>

      {/* comments */}
      <div className="space-y-3">

        {comments
        .filter(c=>!c.parent_id)
        .map(comment=>(
          <CommentItem
          key={comment.id}
          comment={comment}
          allComments={comments}
          refresh={fetchComments}
          postId={postId}
          />
        ))}

      </div>

    </div>
  );
}