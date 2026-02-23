import React, { useEffect, useState, useRef } from "react";
import { uploadProfilePhoto, getMyProfile } from "../api/profileApi";
import { useAuth } from "../context/AuthContext";
import { Settings, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../api/postApi";
import PostCard from "../components/Post/PostCard";


export default function Profile() {

  const { user, setUser, logout } = useAuth();
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [posts,setPosts]=useState([])
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(()=>{
    const fetchMyPosts=async()=>{
      try{

         const response = await getAllPosts();  // ✅ yaha data aa raha hai

         if (!response || !Array.isArray(response)) {
         setPosts([]);
        return;
       }
        const myPosts=response.filter(
          (post)=>post.user?.id==user?.id
        )
        setPosts(myPosts)
      }
      catch(err){
        console.log("Post error", err)
        setPosts([])
      }
    }

    if(user?.id){
      fetchMyPosts()
    }

  },[user])

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getMyProfile();
      setUser(data);
    };
    fetchProfile();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      const res = await uploadProfilePhoto(file);
      setUser((prev) => ({
        ...prev,
        profile_photo: res.photo_url,
      }));
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Cover Section */}
      <div className="relative">
        <div className="h-40 md:h-52 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        {/* Profile Image + Pencil */}
        <div className="absolute -bottom-16 left-6 flex items-end gap-2">
          <div className="relative">
            <img
              src={
                preview
                  ? preview
                  : user?.profile_photo
                  ? `http://127.0.0.1:8000/${user.profile_photo}`
                  : "http://127.0.0.1:8000/uploads/profile/dummy_image.png"
              }
              alt="profile"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow-lg"
            />

            {/* Pencil Button (shifted right) */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 -right-3 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
            >
              <Pencil size={15} />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
     {/* PROFILE MAIN CARD */}
<div className="mt-20 px-4 md:px-10 max-w-4xl mx-auto">

  <div className="bg-white rounded-lg shadow p-6">

    <h2 className="text-3xl font-bold">
      {user?.name || "Shivesh Patel"}
    </h2>

    <p className="text-gray-700 mt-2">
      Full-Stack Developer | High-Performance Backend Dev | DSA |
      Logic-Driven Builds That Ship
    </p>

    <p className="text-gray-500 mt-2">
      Oriental Institute of Science & Technology
    </p>

    <p className="text-gray-500 mt-1">
      Bhopal, Madhya Pradesh, India · 
      <span className="text-blue-600 cursor-pointer ml-1">
        Contact info
      </span>
    </p>

    <p className="text-blue-600 font-medium mt-2">
      500+ connections
    </p>

    {/* Open To Button */}
    {/* <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
      Open to
    </button> */}

  </div>

  {/* ANALYTICS SECTION */}
  <div className="bg-white rounded-lg shadow p-6 mt-6">

    <h3 className="text-xl font-semibold mb-2">
      Analytics
    </h3>

    <p className="text-gray-500 text-sm mb-4">
      Private to you
    </p>

    <div className="space-y-6">

      <div>
        <p className="font-semibold text-lg">
          73 profile views
        </p>
        <p className="text-gray-500 text-sm">
          Discover who's viewed your profile.
        </p>
      </div>

      <div>
        <p className="font-semibold text-lg">
          34 post impressions
        </p>
        <p className="text-gray-500 text-sm">
          Check out who's engaging with your posts.
        </p>
      </div>

      <div>
        <p className="font-semibold text-lg">
          20 search appearances
        </p>
        <p className="text-gray-500 text-sm">
          See how often you appear in search results.
        </p>
      </div>

    </div>

  </div>

</div>

      {/* SETTINGS SECTION */}
      <div className="mt-10 px-6 md:px-12 pb-10">
        <div>

          {/* Settings Header */}
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Settings size={18} />
              <h3 className="text-sm font-medium">Settings</h3>
            </div>
          </div>

          {/* Logout appears on click */}
          {open && (
            <div className="mt-4 border-t pt-3">
              <button
                onClick={handleLogout}
                className="text-red-500 text-sm hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}

        </div>
      </div>

      <div>
        {/* ACTIVITY SECTION */}
<div className="mt-8 px-6 md:px-12">

  <div className="bg-white rounded-xl border border-gray-200 p-5">

    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Activity</h3>
        <p className="text-blue-600 text-sm font-medium">
          {posts.length} posts
        </p>
      </div>

      <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded-full text-sm hover:bg-blue-50">
        Create a post
      </button>
    </div>

    <div className="flex gap-3 mt-4">
      <button className="bg-green-700 text-white px-4 py-1 rounded-full text-sm">
        Posts
      </button>
      <button className="border px-4 py-1 rounded-full text-sm">
        More
      </button>
    </div>

  </div>

  {/* POSTS LIST */}
  <div className="mt-6 space-y-4">

    {posts.length === 0 ? (
      <p className="text-gray-500 text-sm">
        You haven’t posted yet.
      </p>
    ) : (
      posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))
    )}

  </div>

</div>
      </div>

    </div>
  );
}