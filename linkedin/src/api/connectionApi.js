import axios from "axios"

const API= "http://localhost:8000"

const axiosInstance = axios.create({
    baseURL:API,
})


axiosInstance.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token")
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }

    return config
})

// send request
export const sendConnectionRequest = async (userId)=>{
    const res= await axiosInstance.post(`/connections/send/${userId}`)
    return res.data
}

// accept request

export const acceptConnection = async ()=>{
    const data  = axiosInstance.post(`/connections/accept/${requestId}`)
    return res.data
}

// reject request

export const rejectConnection = async ()=>{
    const res = axiosInstance.post(`/connections/reject/${requestId}`)
    return  res.data
}

// get status

export const getConnectionStatus = async ()=>{
    const data = await axiosInstance.get(`/connections/status/${userId}`)
}