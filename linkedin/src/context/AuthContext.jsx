import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

// Custom hook so we can use user anywhere
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null); 
  // Stores logged-in user's profile

  const [loading, setLoading] = useState(true); 
  // Prevent flicker on refresh

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/users/me");

        setUser(res.data);  
        // Save profile in global state

      } catch (err) {
        setUser(null); 
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");

    if (token) {
      fetchUser();  
      // If logged in, load profile on refresh
    } else {
      setLoading(false);
    }

  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};