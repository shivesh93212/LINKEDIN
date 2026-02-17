
import React,{useState,useEffect} from "react"
import {Link,useNavigate} from "react-router-dom"
import AuthLayout from "../components/Auth/AuthLayout"
import {signupUser} from "../api/authApi"



export default function Register(){
    const navigate=useNavigate()


    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    const [loading,setLoading]=useState(false)
    const [success,setSuccess]=useState("")
    const [error,setError]=useState("")


    const handelRegister = async (e)=>{
        e.preventDefault()
        setError("")
        setSuccess("")

        try{
            setLoading(true)

            const data=await signupUser(name,email,password)

            setSuccess(data.message || "User Created Successfully!")

            setTimeout(()=>{
                navigate("/login")
            },1500)
        }

        catch(err){
            setError(err.response?.data?.detail || "Signup failed!")
        }

        finally{
            setLoading(false)
        }

        useEffect(()=>{
            const token=localStorage.getItem("token")
            if(token){
                navigate("/",{replace:true})
            }
        },[navigate])
    }


    return(
        <AuthLayout>
             <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Join LinkedIn
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                     Make the most of your professional life
                </p>

                {error && (
                    <div className="mt-4 bg-red-100 text-rwd-700 text-sm p-3 rounded-lg">
                        {error}
                        </div>
                ) }

                {success && (
                    <div className="mt-4 bg-green-100 text-green-700 text-sm p-3 rounded-lg">
                        {success}
                        </div>
                )}

                <form onSubmit={handelRegister} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-gray-700 font-medium">
                            Full Name
                        </label>
                        <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700 font-medium">
                            Email
                        </label>

                        <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focu:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700 font-medium">
                            Password
                        </label>

                        <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <button
                    type="submit"
                    disable={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                    >
                        {loading ? "Creating Account..." : "Sign up"}
                    </button>
                </form>

                 <div className="flex items-center gap-3 my-6">
                   <div className="h-[1px] bg-gray-300 flex-1"></div>
                   <span className="text-sm text-gray-500">or</span>
                   <div className="h-[1px] bg-gray-300 flex-1"></div>
                 </div>
                 
                <button className="w-full border border-gray-400 py-2 rounded-full font-semibold text-gray-700 hover:bg-gray-100 transition">
                    Sign up with Google
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already on LinkedIn?{""}
                    <Link
                    to="/login"
                    className="text-blue-600 font-semibold hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
                
             </div>
        </AuthLayout>
    )
}