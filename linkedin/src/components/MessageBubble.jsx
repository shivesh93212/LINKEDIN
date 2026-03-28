import {useAuth} from "../context/AuthContext"

export default function MessageBubble({message}){
    const {user}=useAuth()

    const isOwn=message.sender_id==user.id

    return (
        <div className={`flex mb-3 ${isOwn ? "justify-end":"justify-start"}`}>
             <div
               className={`px-4 py-2 rounded-lg max-w-xs text-sm
                  ${
                    isOwn
                      ?"bg-blue-600 text-white"
                      :"bg-gray-200 text-gray-800"
                  }`}
                  >
                    {message.content}
                    
             </div>
                 {isOwn && (

                  <span className="text-xs ml-2">
                  {message.is_read ? "✓✓" : "✓"}
                 </span>
                 )}
        </div>
    )
}