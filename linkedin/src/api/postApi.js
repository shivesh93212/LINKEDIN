import axiosInstance from "./axiosInstance";

export const createPost=async(content)=>{
    const response =await axiosInstance.post("/post/",{
        content,
    })
    return response.data
}

export const getFeedPosts=async (page=1,limit=10)=>{
    const response=await axiosInstance.get(`/post/feed?page=${page}&limit=${limit}`)
    return response.data
}

export const deletePost = async (postId)=>{
    const response = await axiosInstance.delete(`/posts/${postId}`)
    return response.data
}

export const uploadPostImage = async (postId,file)=>{
    const formData=new FormData()
    formData.append("file",file)
    const response = await axiosInstance.post(`/posts/${postId}/image`,formData,{
        headers:{
            "Content-Type":"multipart/form-data",
        },
    })

    return response.data
}