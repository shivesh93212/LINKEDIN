import axiosInstance from "./axiosInstance";


// add comment on post
export  async function addCommentOnPost(postId,content,parent_id=null){
    const res= await axiosInstance.post(`/comments/${postId}`,{
        content:content,
        parent_id
    })
    return res.data;
}

// get comment on post
export  async function getCommentOnPost(postId){
    const res=await axiosInstance.get(`/comments/${postId}`)
    return res.data
}

// delete own Comment
export  async function deleteOwnComment(commentId){
    const res=await axiosInstance.delete(`/comments/${commentId}`)
    return res.data
}

