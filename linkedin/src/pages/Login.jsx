
import React from "react"
import {Link} from "react-router-dom"
import AuthLayout from "../components/Auth/AuthLayout"

export default function Login(){

    return (
        <AuthLayout>
            <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Sign in
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                    Stay updated on your professional world
                </p>

                <form className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-gray-700 font-medium">
                            Email or Phone
                            </label>

                            <input
                            type="text"
                            placeholder="Enter email or phone"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium">
                                Password                            
                            </label>

                            <input 
                            type="text"
                            placeholder="Enter password"
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
                            Sign in
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
            New to LinkedIn{""}
            <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
            >
                Join now
            </Link>
        </p>
            </div>
        </AuthLayout>
    )
}