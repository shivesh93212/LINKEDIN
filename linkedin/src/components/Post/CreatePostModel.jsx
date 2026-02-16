import React, { useState, useEffect } from "react";
import { X, Image, Video, Calendar, FileText } from "lucide-react";

export default function CreatePostModel({ isOpen, onClose }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose(); // ✅ fixed
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null; // ✅ fixed

  return (
    <div 
    onClick={onClose}
    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3"
    >

      <div 
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-full max-w-xl rounded-xl shadow-lg overflow-hidden" 
      >
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create a post</h2>

          <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20}  className="text-gray-600" />
          </button>
        </div>

        {/* USER INFO */}
        <div className="flex items-center gap-3 px-4 py-4">
          <img src="https://i.pravatar.cc/60" alt="profile" 
          className= "w-12 h-12 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-900">Shivesh Patel</h3>
            <p className="text-xs text-gray-500">Post to Anyone</p>
          </div>
        </div>

        {/* TEXTAREA */}
        <div className="px-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full min-h[120px] resize-none outline-none text-gray-800 text-sm placeholder-gray-500"
          />
        </div>

        {/* OPTIONS */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 text-gray-600">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <Image size={20} />
          </button>

          <button className="p-2 rounded-full hover:bg-gray-200">
            <Video size={20} />
          </button>

          <button className="p-2 rounded-full hover:bg-gray-200">
            <Calendar size={20} /> 
          </button>

          <button className="p-2 rounded-full hover:bg-gray-200">
            <FileText size={20} />
          </button>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3">
          <button disabled={!content.trim()}
          className="bg-blue-600 text-white px-6 rounded-full font-semibold disabled:opacity-50 hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
