import React, { useEffect, useState, useRef } from "react";
import { uploadProfilePhoto, getMyProfile } from "../api/profileApi";
import { getAllPosts } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import { Settings, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/Post/PostCard";
import ConnectionButton from "../components/ConnectionButton";
import CreatePostModel from "../components/Post/CreatePostModel";

export default function Profile() {

  const { id } = useParams();              // ✅ route param
  const profileUserId = id ? Number(id) : null;   // ✅ define properly

  const { user, setUser, logout } = useAuth();
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const [isPostModel,setIsPostModel]=useState(false)

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const loadProfileAndPosts = async () => {
      try {
        const profileData = await getMyProfile();
        setUser(profileData);

        const response = await getAllPosts();

        if (!response || !Array.isArray(response)) {
          setPosts([]);
          return;
        }

        const myPosts = response.filter(
          (post) => post.user?.id === profileData.id
        );

        setPosts(myPosts);

      } catch (err) {
        console.log("Error loading profile or posts:", err);
        setPosts([]);
      }
    };

    loadProfileAndPosts();
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
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* COVER */}
      <div className="relative">
        <div className="h-40 md:h-52 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-6">
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

      {/* MAIN CONTENT */}
      <div className="mt-20 px-4 md:px-10 max-w-4xl mx-auto">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-lg shadow p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-3xl font-bold">
              {user?.name}
            </h2>

            {/* ✅ Button show only if profileUserId exists AND not own profile */}
            {profileUserId && profileUserId !== user?.id && (
              <ConnectionButton profileUserId={profileUserId} />
            )}

          </div>

          <p className="text-blue-600 font-medium mt-2">
            {user?.followers_count ?? 0} followers
          </p>

          <p className="text-gray-700 mt-2">
            Full-Stack Developer | High-Performance Backend Dev | DSA |
            Logic-Driven Builds That Ship
          </p>

          <p className="text-gray-500 mt-2">
            Oriental Institute of Science & Technology
          </p>

          <p className="text-gray-500 mt-1">
            Bhopal, Madhya Pradesh, India · 
            <span className="text-blue-600 ml-1 cursor-pointer">
              Contact info
            </span>
          </p>

          <p className="text-blue-600 font-medium mt-2">
            {user?.followers_count ?? 0} connections
          </p>

        </div>

        {/* ACTIVITY */}
        <div className="mt-8">

          <div className="bg-white rounded-xl border border-gray-200 p-5">

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Activity</h3>
                <p className="text-blue-600 text-sm font-medium">
                  {posts.length} posts
                </p>
              </div>

              <button
              onClick={()=>setIsPostModel(true)}
               className="border border-blue-600 text-blue-600 px-4 py-1 rounded-full text-sm hover:bg-blue-50">
                Create a post
              </button>
            </div>

          </div>

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

        {/* SETTINGS */}
        <div className="mt-10 pb-10">
          <div className="bg-white rounded-lg shadow p-5">

            <div
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings size={18} />
                <h3 className="text-sm font-medium">Settings</h3>
              </div>
            </div>

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

      </div>
     <CreatePostModel
      isOpen={isPostModel}
      onClose={()=>setIsPostModel(false)}
      
     />
    </div>
  );
}