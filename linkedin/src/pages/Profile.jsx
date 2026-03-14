import React, { useEffect, useState, useRef } from "react";
import { uploadProfilePhoto, getMyProfile } from "../api/profileApi";
import { getAllPosts } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import { Settings, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/Post/PostCard";
import ConnectionButton from "../components/ConnectionButton";
import CreatePostModel from "../components/Post/CreatePostModel";
import { getUserProfile,updateUserProfile } from "../api/profileApi";

export default function Profile() {

  const { id } = useParams(); // route param

  const { user: loggedInUser, logout } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const [isPostModel,setIsPostModel]=useState(false)
  const [isEditOpen,setisEditOpen]=useState(false)
  
  const [editData,setEditData]=useState({
    name:"",
    headline:"",
    about:"",
    skills:"",
    experience:"",
    education:"",
    location:""
  })

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ FIX: profileUserId remove ho chuka hai, id use karo
  const isOwnProfile =
    !id || Number(id) === Number(loggedInUser?.id);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

useEffect(() => {
  if (!loggedInUser) return;

  const loadProfileAndPosts = async () => {
    try {

      let data;

      // ✅ FIX: correct profile loading logic
      if (id && Number(id) !== Number(loggedInUser?.id)) {
        data = await getUserProfile(Number(id));
      } else {
        data = await getMyProfile();
      }

      setProfileUser(data);

      setEditData({
        name:data.name || "",
        headline:data.headline || "",
        about:data.about || "",
        skills:data.skills || "",
        experience:data.experience || "",
        education:data.education || "",
        location:data.location || ""
      })

      const response = await getAllPosts();

      if (!response || !Array.isArray(response)) {
        setPosts([]);
        return;
      }

      const userPosts = response.filter(
        (post) => post.user?.id === data.id
      );

      setPosts(userPosts);

    } catch (err) {
      console.log("Error loading profile:", err);
      setPosts([]);
    }
  };

  loadProfileAndPosts();

// ✅ FIX: dependency me profileUserId ki jagah id use karo
}, [id, loggedInUser]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
       await uploadProfilePhoto(file);
       const updatedProfile=await getMyProfile()
       setProfileUser(updatedProfile)
    } 
    
    catch {
      alert("Upload failed");
    }
  };
    

  const handleChange=(e)=>{
    setEditData({
      ...editData,
      [e.target.name]:e.target.value
    })
  }

  const handleSaveProfile = async()=>{
    try{
      await updateUserProfile(editData)
      const updatedProfile=await getMyProfile()
      setProfileUser(updatedProfile)
      setEditData({
            name:updatedProfile.name || "",
            headline:updatedProfile.headline || "",
            about:updatedProfile.about || "",
            skills:updatedProfile.skills || "",
            experience:updatedProfile.experience || "",
            education:updatedProfile.education || "",
            location:updatedProfile.location || ""
})
      setisEditOpen(false)
    }
    catch(err){
      console.log("Updated failed",err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="relative">
        <div className="h-40 bg-zinc-300 rounded-t-xl relative overflow-hidden"></div>

        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <img
              src={
                preview
                  ? preview
                  : profileUser?.profile_photo
                  ? `http://localhost:8000/${profileUser.profile_photo}`
                  : "http://localhost:8000/uploads/profile/dummy_image.png"
              }
              alt="profile"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow-lg"
            />

            {isOwnProfile && (
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 -right-3 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
            >
              <Pencil size={15} />
            </button>
            )}

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

      <div className="mt-20 px-4 md:px-10 max-w-4xl mx-auto">

        <div className="bg-white rounded-lg shadow p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold mb-1">
              {profileUser?.name}
            </h2>

            {!isOwnProfile &&  id &&(
              // ✅ FIX: profileUserId remove ho chuka hai
              <ConnectionButton profileUserId={Number(id)} />
            )}

          </div>

          <p className="text-gray-700 mt-2 text-sm font-semibold">
            {profileUser?.skills}
          </p>

          <p className="text-gray-500 mt-5 text-[14px]">
            {profileUser?.education}
          </p>

          <p className="text-gray-600 text-[12px] font-semibold">
            {profileUser?.location} 
            <span className="text-blue-600 ml-1 cursor-pointer">
              Contact info
            </span>
          </p>

          <div className="flex gap-5 mt-4">

<p className="text-blue-600 font-medium">
  {profileUser?.followers_count ?? 0} connections
</p>

{isOwnProfile && (
<button
  onClick={()=>setisEditOpen(true)}
  className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded-full"
>
  Edit Profile
</button>
)}

</div>

        </div>

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

      </div>

     <CreatePostModel
      isOpen={isPostModel}
      onClose={()=>setIsPostModel(false)}
     />

    </div>
  );
}