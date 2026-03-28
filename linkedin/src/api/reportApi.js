import axiosInstance from "./axiosInstance";

// report post api
export const reportPost=async(postId,reason)=>{
    const res=await axiosInstance.post(`reports/post/${postId}`,{
        reason:reason,
    })
    return res.data;
}