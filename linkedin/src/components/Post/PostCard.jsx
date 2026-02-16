import React from "react";
import { deletePost } from "../../api/postApi";

export default function PostCard({ post, onDelete }) {
  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      onDelete(post.id);
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed!");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <img
            src="https://i.pravatar.cc/50"
            alt="user"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-gray-900">
              User {post.user_id}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="text-sm text-red-600 font-semibold hover:underline"
        >
          Delete
        </button>
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
        <button className="hover:text-blue-600">👍 Like</button>
        <button className="hover:text-blue-600">💬 Comment</button>
        <button className="hover:text-blue-600">🔁 Repost</button>
        <button className="hover:text-blue-600">📤 Send</button>
      </div>
    </div>
  );
}
