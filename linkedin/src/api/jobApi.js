import axiosInstance from "./axiosInstance";

export const jobApi= async(query,page=1)=>{
      const res=await axiosInstance.get("/jobs/search",{
        params:{
            q:query,
            page:page
        }
      })
      return res.data
}