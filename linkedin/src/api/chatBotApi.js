import axiosInstance from "./axiosInstance";

export const chatBotApi=async(message)=>{
    const res=await axiosInstance.post("/ai/chat",{
        prompt:message
    })
    return res.data
}