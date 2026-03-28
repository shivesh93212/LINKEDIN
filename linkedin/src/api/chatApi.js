import axiosInstance from "./axiosInstance";

// send message api

export const sendMessage = async (receiverId, content) => {
  const res = await axiosInstance.post("/chat/send", {
    receiver_id: receiverId,
    content: content
  });

  return res.data;
};

// get chat between two users

export const getChat = async (userId) => {
  const res = await axiosInstance.get(`/chat/${userId}`);
  return res.data;
};

// mark message as read

export const markReadMessage = async (messageId) => {
  const res = await axiosInstance.post(`/chat/read/${messageId}`);
  return res.data;
};

// chat list api

export const getChatList = async () => {
  const res = await axiosInstance.get("/chat/list");
  return res.data;
};

// websocket api

export const webSocketApi=async()=>{
  const res=await axiosInstance.websocket("/")
}