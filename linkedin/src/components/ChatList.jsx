import { getChatList } from "../api/chatApi";
import {useEffect,useState} from "react"
import { useNavigate } from "react-router-dom"

export default function ChatList({selectUser}){

    const [chats,setChats]=useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        loadChats()
    },[])

    const loadChats=async()=>{
        try{
            const data=await getChatList()
            setChats(data)
        }
        catch(err){
            console.log(err)
        }
    }

    return (
       <div className="w-[320px] h-full border-r bg-white overflow-y-auto flex-shrink-0">

  {/* Header */}
  <div className="flex items-center gap-3 p-4 border-b">

    <button
      onClick={()=>navigate(-1)}
      className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
    >
      ←
    </button>

    <span className="font-semibold text-lg">
      Messages
    </span>

  </div>

  {chats.map((chat) => (
    <div
      key={chat.user_id}
      onClick={() => selectUser(chat)}
      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 border-b transition"
    >

      <img
        src={chat.profile_photo 
        ? ` https://prolinker-pqo7.onrender.com/${chat.profile_photo}`
        : " https://prolinker-pqo7.onrender.com/uploads/profile/dummy_image.png"}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex flex-col">
        <p className="font-medium">{chat.name}</p>

        <p className="text-sm text-gray-500 truncate w-[150px]">
          {chat.last_message}
        </p>
      </div>

    </div>
  ))}

</div>
    )
}