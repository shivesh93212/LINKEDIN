import axios from "axios";

const API = " https://prolinker-pqo7.onrender.com"

export const toggleLike = async (postId) => {
  const res = await axios.post(
    `${API}/likes/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
  return res.data;
};

export const getLikeCount = async (postId)=>{
    const res=await axios.get(`${API}/likes/count/${postId}`)
    return res.data
}

export const getLikeStatus = async (postId) => {
  const res = await axios.get(
    `${API}/likes/status/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
  return res.data;
};