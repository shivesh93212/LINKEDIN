import React, { useEffect, useState, useRef } from "react";
import { uploadProfilePhoto, getMyProfile } from "../api/profileApi";
import { getAllPosts } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import { Settings, Pencil,LogOut } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/Post/PostCard";
import ConnectionButton from "../components/ConnectionButton";
import CreatePostModel from "../components/Post/CreatePostModel";
import { getUserProfile,updateUserProfile } from "../api/profileApi";

export default function Profile() {

  const { id } = useParams();

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

  const isOwnProfile =
    !id || Number(id) === Number(loggedInUser?.id);

  const handleLogout = () => {
    logout();
     window.location.href = "/login";
  };

useEffect(() => {
  if (!loggedInUser) return;

  const loadProfileAndPosts = async () => {
    try {

      let data;

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

  const [showAllPost,setShowAllPost]=useState(false)

  const displayPost= showAllPost?posts : posts.slice(0,2)

  return (
    <div className="min-h-screen bg-gray-50 pb-2">
     
      <div className="relative">
       <div className="h-40 bg-zinc-300 rounded-t-xl relative overflow-hidden">

  <button
    onClick={() => navigate(-1)}
    className="absolute top-3 left-3 bg-white w-8 h-8 rounded-full  flex items-center justify-center shadow hover:bg-gray-100"
  >
    ✕
  </button>

</div>
           
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <img
              src={
                preview
                  ? preview
                  : profileUser?.profile_photo
                  ? ` https://prolinker-pqo7.onrender.com/${profileUser.profile_photo}`
                  : " https://prolinker-pqo7.onrender.com/uploads/profile/dummy_image.png"
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

<p className="text-blue-600 font-medium text-sm">
  {profileUser?.connections_count ?? 0} connections
</p>

{isOwnProfile && (
<button
  onClick={()=>setisEditOpen(true)}
  className="text-sm text-blue-600 border border-blue-600 -mt-1 px-3 py-1 rounded-full"
>
  Edit Profile
</button>
)}
{/* message button */}

{!isOwnProfile && ( 

   <button
  onClick={()=>navigate(`/messages?user=${id}`)}
  className="text-sm text-blue-600 border border-blue-600 -mt-1 px-5 py-1 rounded-full font-semibold"
>
  Message
</button>

)}
</div>

        {/* ✅ EDIT PROFILE MODAL */} {isEditOpen && ( <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"> <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg"> <h2 className="text-xl font-semibold mb-4"> Edit Profile </h2> {/* name */} <input name="name" value={editData.name} onChange={handleChange} placeholder="Your full name" className="w-full border p-2 rounded mb-3" /> {/* SKILLS */} <input name="skills" value={editData.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full border p-2 rounded mb-3" /> {/* HEADLINE <input name="headline" value={editData.headline} onChange={handleChange} placeholder="Headline" className="w-full border p-2 rounded mb-3" /> */} {/* ABOUT */} {/* <textarea name="about" value={editData.about} onChange={handleChange} placeholder="About" className="w-full border p-2 rounded mb-3" /> */} {/* EXPERIENCE */} <input name="experience" value={editData.experience} onChange={handleChange} placeholder="Experience" className="w-full border p-2 rounded mb-3" /> {/* EDUCATION */} <input name="education" value={editData.education} onChange={handleChange} placeholder="Education" className="w-full border p-2 rounded mb-3" /> {/* LOCATION */} <input name="location" value={editData.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded mb-3" /> {/* BUTTONS */} <div className="flex justify-end gap-3 mt-4"> <button onClick={() => setisEditOpen(false)} className="px-4 py-1 border rounded" > Cancel </button> <button onClick={handleSaveProfile} className="px-4 py-1 bg-blue-600 text-white rounded" > Save </button> </div> </div> </div> )}

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

              {isOwnProfile && (
              <button
              onClick={()=>setIsPostModel(true)}
               className="border border-blue-600 text-blue-600 px-4 py-1 rounded-full text-sm hover:bg-blue-50">
                Create a post
              </button>
              )}

            </div>

          </div>

          <div className="mt-6 space-y-4">
            {posts.length === 0 ? (
              <p className="text-gray-500 text-sm">
                You haven’t posted yet.
              </p>
            ) : (
              displayPost.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>

          {!showAllPost && posts.length > 2 &&(
            <div className="flex justify-center">
              <button
              onClick={()=>setShowAllPost(true)}
              className="text-blue-600 text-sm font-semibold hover:underline p-5"
              >
                Show All Posts
              </button>
              </div>
          )}

        </div>

      </div>
     {isOwnProfile && (

     <div className="mt-10 pb-10">
     <div className="bg-white rounded-lg shadow p-5">
     <div onClick={() => setOpen(!open)} className="flex items-center justify-between cursor-pointer" >
     <div className="flex items-center gap-2">
     <Settings size={18} />
     <h3 className="text-sm font-medium">Settings</h3>
     </div>
     </div>

     {open && (
     <div className="mt-4 border-t pt-3">
     <button onClick={handleLogout} className="text-red-500 text-sm hover:text-red-600" >
     Logout
     </button>
     </div>
     )}

     </div>
     </div>
     )}

     <CreatePostModel isOpen={isPostModel} onClose={()=>setIsPostModel(false)} />

    </div>
  );
}