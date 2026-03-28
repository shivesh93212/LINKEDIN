

import React from "react"
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import Profile from "./pages/Profile"
import Messages from "./pages/Messages"; // ✅ NEW
import Network from "./pages/Network"; // ✅ NEW
import Jobs from "./pages/Jobs"; // ✅ NEW
import Notifications from "./pages/Notifications"; // ✅ NEW
import { AuthProvider } from "./context/AuthContext"
import CommentsPage from "./pages/CommentsPage";
import ChatBot from "./pages/ChatBot"


<Route path="/post/:postId/comments" element={<CommentsPage />} />
function App() {
 

  return (

    <BrowserRouter>
    <AuthProvider>
    <Routes> 

    <Route path="/" element={<ProtectedRoute> <Home/> </ProtectedRoute>} />
    <Route path="/login" element={<Login/>}/>
    <Route 
  path="/profile/:id" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } 
/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/profile" element={<ProtectedRoute> <Profile/> </ProtectedRoute>}/>
    <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />  {/* ✅ NEW */}
    <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />    {/* ✅ NEW */}
    <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />          {/* ✅ NEW */}
    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} /> {/* ✅ NEW */}
    <Route path="/post/:postId/comments" element={<CommentsPage />} />
    <Route path="/chatbot" element={<ChatBot/>}/>

    <Route path="*" element={<h1 className="text-center mt-10">404 Page Not Found</h1>}/>

    </Routes>
    </AuthProvider>
    </BrowserRouter>
    
  )
}
export default App
