import React, { useEffect, useState } from "react";
import { uploadProfilePhoto, getMyProfile } from "../api/profileApi";
import { useAuth } from "../context/AuthContext";

export default function Profile() {

  const { user, setUser } = useAuth();  
  // Get global user + ability to update it

  const [preview, setPreview] = useState(null);  
  // Temporary image preview before upload

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getMyProfile();
      setUser(data);  
      // Make sure context updated
    };

    fetchProfile();
  }, []);

  const handlePhotoChange = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    // Show instant preview
    setPreview(URL.createObjectURL(file));

    try {
      const res = await uploadProfilePhoto(file);

      // Update global user state with new photo
      setUser((prev) => ({
        ...prev,
        profile_photo: res.photo_url
      }));

    } catch (err) {
      alert("Upload failed");
    }
    console.log("USER AFTER REFRESH:", user);
  };

  return (
    <div className="p-6">

      <label className="cursor-pointer relative">

      <img
  src={
    preview
      ? preview
      : user?.profile_photo
      ? `http://127.0.0.1:8000/${user.profile_photo}`
      : "http://127.0.0.1:8000/uploads/profile/dummy_image.png"
  }
  alt="profile"
  className="w-32 h-32 rounded-full object-cover"
/>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

      </label>

      <h2 className="mt-4 text-xl font-semibold">
        {user?.name || "Your Name"}
      </h2>

    </div>
  );
}