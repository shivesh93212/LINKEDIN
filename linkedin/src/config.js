const BASE_URL = "https://prolinker-pqo7.onrender.com";

export const getProfileImage = (profile_photo) => {
  if (!profile_photo) {
    return `${BASE_URL}/uploads/profile/dummy_image.png`;
  }

  return `${BASE_URL}/${profile_photo}`;
};