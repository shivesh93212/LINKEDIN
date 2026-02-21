import axiosInstance from "./axiosInstance";

/*
========================================
GET MY PROFILE
========================================
Calls: GET /users/profile
Returns: logged in user profile data
*/

export const getMyProfile = async () => {
  const response = await axiosInstance.get("/users/profile");

  return response.data;
};

/*
========================================
UPDATE PROFILE
========================================
Calls: POST /users/profile
Body: profile fields (name, headline, etc.)
*/



export const updateProfile = async (profileData) => {
  const response = await axiosInstance.post(
    "/users/profile",
    profileData
  );

  return response.data;
};

/*
========================================
UPLOAD PROFILE PHOTO
========================================
Calls: POST /users/profile/photo
Body: multipart/form-data
*/

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    "/users/profile/photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/*
========================================
GET OTHER USER PROFILE
========================================
Calls: GET /users/{user_id}
*/

export const getUserProfile = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);

  return response.data;
};