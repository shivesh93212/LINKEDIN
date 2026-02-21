const BASE_URL = "http://127.0.0.1:8000";

export const getProfileImage = (profile_photo) => {
  if (!profile_photo) {
    return `${BASE_URL}/uploads/profile/dummy_image.png`;
  }

  return `${BASE_URL}/${profile_photo}`;
};