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

export const acceptConnection = async (requestId)=>{
    const res  = axiosInstance.post(`/connections/accept/${requestId}`)
    return res.data
}

// reject request

export const rejectConnection = async (requestId)=>{
    const res = axiosInstance.post(`/connections/reject/${requestId}`)
    return  res.data
}

// get status

export const getConnectionStatus = async (userId)=>{
    const res = await axiosInstance.get(`/connections/status/${userId}`)
    return res.data
}

// pending status

export const getRequests = ()=>{
    return axiosInstance.get(`/connections/requests`);

}

// my connections

export const getConnections = ()=>{
    return axiosInstance.get(`/connections/me`);
}