import React, { useState, useEffect } from "react";
import { X, Image, Video, Calendar, FileText } from "lucide-react";
import { createPost,uploadPostImage } from "../../api/postApi";
import { getProfileImage } from "../../config";
import { useAuth } from "../../context/AuthContext";

export default function CreatePostModel({ isOpen, onClose,onPostCreated }) {
  const {user}=useAuth()
  
  const [content, setContent] = useState("");
  const [selectedImage,setSelectedImage]=useState("")

  const [loading,setLoading]=useState(false)
  const [err,setErr]=useState("")
  
  

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(()=>{
    if(isOpen){
      setContent("")
      setSelectedImage(null)
      setErr("")
    }
  },[isOpen])

  if (!isOpen) return null;



  const handleImageChange=(e)=>{
    if(e.target.files && e.target.files[0]){
      setSelectedImage(e.target.files[0])
    }
  }

 const handleCreatePost = async () => {
  setErr("");
  try {
    setLoading(true);

    const post = await createPost(content);

    let imageUrl = null;

    if (selectedImage) {
      const res = await uploadPostImage(post.id, selectedImage);
      imageUrl = res.image_url;
    }

    // 🔥 NEW POST WITH IMAGE
    const newPost = {
      ...post,
      image_url: imageUrl,
      user: user,
    };

    if (onPostCreated) {
      onPostCreated(newPost);
    }

    onClose();
  } catch (err) {
    setErr(err.response?.data?.detail || "Post creation failed");
  } finally {
    setLoading(false);
  }
};


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
          <img src={user?.profile_photo || "https://via.placeholder.com/150"} alt="profile" 
          className= "w-12 h-12 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-xs text-gray-500">Post to Anyone</p>
          </div>
        </div>
         
         {err && (
          <div className="px-4 pb-2">
            <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">
              {err}
            </p>
            </div>
         )}
        {/* TEXTAREA */}
        <div className="px-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full min-h[120px] resize-none outline-none text-gray-800 text-sm placeholder-gray-500"
          />
        </div>

        {selectedImage && (
          <div className="px-4 mt-3">
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <p className="text-sm text-gray-700 truncate">
                {selectedImage.name}
              </p>

              <button
              onClick={()=>setSelectedImage(null)}
              className="text-sm text-red-600 font-semibold">
                Remove
              </button>

              </div>
              </div>
        )}

        {/* OPTIONS */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 text-gray-600">
          <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <Image size={20}/>
            <input
            type="file"
            accept="/image"
            className="hidden"
            onChange={handleImageChange}
            />
          </label>

          {/* <button className="p-2 rounded-full hover:bg-gray-200">
            <Video size={20} />
          </button> */}

          <button className="p-2 rounded-full hover:bg-gray-200">
            <Calendar size={20} /> 
          </button>

          <button className="p-2 rounded-full hover:bg-gray-200">
            <FileText size={20} />
          </button>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3">
          <button 
          onClick={handleCreatePost}
          disabled={!content.trim() && !selectedImage || loading}
          className="bg-blue-600 text-white px-6 rounded-full font-semibold disabled:opacity-50 hover:bg-blue-700 transition"
          >
            {loading ? "Posting" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
