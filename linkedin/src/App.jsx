

import React from "react"
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"



function App() {
 

  return (

    <BrowserRouter>
    <Routes> 

    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    
    <Route path="*" element={<h1 className="text-center mt-10">404 Page Not Found</h1>}/>

    </Routes>
    </BrowserRouter>
    
  )
}
export default App
