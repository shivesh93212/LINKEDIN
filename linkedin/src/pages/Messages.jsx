import { useState, useEffect } from "react"
import ChatList from "../components/ChatList"
import ChatWindow from "../components/ChatWindow"
import { useSearchParams } from "react-router-dom"

export default function Messages(){

  const [searchParams] = useSearchParams()
  const [selectedUser,setSelectedUser] = useState(null)

  const userId = searchParams.get("user")

  useEffect(()=>{
    if(userId){
      setSelectedUser({
        user_id: Number(userId),
        
      })
    }
  },[userId])

  return (
    <div className="flex h-[100dvh] bg-white border rounded-xl shadow-lg overflow-hidden">

      {/* Chat List */}
      <div className={`${selectedUser ? "hidden md:block" : "block"}`}>
        <ChatList selectUser={setSelectedUser} />
      </div>

      {/* Chat Window */}
     <div className={`flex-1 flex flex-col ${selectedUser ? "block md:flex" : "hidden md:flex"}`}>
        {selectedUser ? (
          <ChatWindow user={selectedUser} back={()=>setSelectedUser(null)} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            Select a conversation
          </div>
        )}
      </div>

    </div>
  )
}