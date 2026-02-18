
import React, {useState,useEffect} from "react"
import {Link,useNavigate} from "react-router-dom"
import AuthLayout from "../components/Auth/AuthLayout"
import {loginUser} from "../api/authApi"


export default function Login(){
       const navigate=useNavigate()

       const [email,setEmail]=useState("")
       const [password,setPassword]=useState("")

       const [loading,setLoading]=useState(false)
       const [error,setError]=useState("") 

        useEffect(()=>{
          const token=localStorage.get("token")

          if(token){
            navigate("/",{replace:true})
          }
       },[navigate])

       const handleLogin = async (e)=>{
        e.preventDefault()
        setError("")

        try{
            setLoading(true)

            const data=await loginUser(email,password)
            if(!data){
                setError("No response from backend!")
                return
            }

            if(!data.access_token){
                setError("Token missing in response!")
                    return
            
            }

            localStorage.setItem("token",data.access_token)
            console.log("LOGIN SUCCESS, GOING HOME...");
            navigate("/",{replace:true})
        }

        catch(err){
            setError(err.response?.data?.detail || "Login failed")

       }

       finally{
        setLoading(false)
       }

      

       }
    return (
        <AuthLayout>
            <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Sign in
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                    Stay updated on your professional world
                </p>
                
                {error && (
                    <div className="mt-4 bg-red-100 text-red-700 text-sm p-3 rounded-lg">
                        {error}
                        </div>
                )}

                
                <form  onSubmit={handleLogin} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-gray-700 font-medium">
                            Email or Phone
                            </label>

                            <input
                            type="text"
                            placeholder="Enter email or phone"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium">
                                Password                            
                            </label>

                            <input 
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                            type="button"
                            className="text-sm font-semibold text-blue-600 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                        
                        <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transtion"
                        >
                            {loading ? "Signing in..." : "Sign in" }
                        </button>
                </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-[1px] bg-gray-300 flex-1"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="h-[1px] bg-gray-300 flex-1"></div>
        </div>

        <button className="w-full border border-gray-400 py-2 rounded-full font-semibold text-gray-700 hover:bg-gray-100 transition">
            Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
            New to LinkedIn?{""}
            <Link
            to="/register"
            className="text-blue-600 font-semibold  hover:underline"
            >
                Sign up
            </Link>
        </p>
            </div>
        </AuthLayout>
    )
}