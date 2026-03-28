
import axiosInstance from "./axiosInstance"

// search user

export const searchUserApi=async(query)=>{
      const res= await axiosInstance.get("/search/users",{
        params:{q:query}
      })
      return res.data;
}