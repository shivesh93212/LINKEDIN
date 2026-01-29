
import {createContext,useContext,useState} from "react"
import api from "../api/axios"

const AuthContext=createContext()

export const AuthProvider=({children})=>{
    const[user,setUser]=useState(null);
    const[token,setToken]=useState(localStorage.getItem("token"));

    // login function

    const login =async(email,password)=>{
        const formData=new FormData();
        formData.append("username",email);
        formData.append("password",password);

        const res=await api.post("/auth/algon",formData);

        localStorage.setItem("token",res.data.access_token);
        setToken(res.data.access_token);

        await fetchMe()
    }

    const fetchMe=async()=>{
        const res=await api.get("users/me");
        setUser(res.data);
    };

    const logout=()=>{
        localStorage.removeItem("token");
        setUser(null);
        setToken(null)
    };

    return (
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth=()=>useContext(AuthContext);