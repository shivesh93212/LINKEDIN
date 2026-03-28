import axiosInstance from "./axiosInstance"


export const signupUser =async (name,email,password)=>{
      const response= await axiosInstance.post("/auth/signup",{
        name,
        email,
        password,
      })

      return response.data
}


export const loginUser=async (email,password)=>{
    const params=new URLSearchParams()
    params.append("username",email)
    params.append("password",password)
    const response= await axiosInstance.post("/auth/login",params,{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
        },
    })
    

    return response.data
}