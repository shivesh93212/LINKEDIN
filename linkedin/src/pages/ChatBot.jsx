import React,{useState,useRef, useEffect} from "react"
import { chatBotApi } from "../api/chatBotApi"
import { useNavigate } from "react-router-dom"

export default function ChatBot(){
    const bottomRef=useRef(null)
    const navigate = useNavigate()

    const [message,setMessage]=useState("")
    const [messages,setMessages]=useState([])

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])

    const sendMessage=async()=>{

        if(!message.trim()) return

        const userMsg = message

        // user message show
        setMessages(prev => [...prev,{role:"user",text:userMsg}])

        setMessage("")   // input clear

        const data = await chatBotApi(userMsg)

        // AI reply show
        setMessages(prev => [...prev,{role:"ai",text:data.response}])
    }

    return(

        <div className="flex flex-col h-screen bg-gray-100">

            {/* Header */}

            <div className="flex items-center gap-3 bg-gray-700 text-white p-3 shadow">
                <button
                onClick={()=>navigate(-1)}
                className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500">
                    ← Back
                </button>

                <h2 className="font-semibold text-lg">
                    AI ChatBot
                </h2>
            </div>


            {/* Chat area */}

            <div className="flex-1 p-4 overflow-y-auto space-y-3">

                {messages.map((msg,i)=>(
                    <div
                    key={i}
                    className={`max-w-lg p-3 rounded-lg shadow
                    ${msg.role==="user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-white text-black"}
                    `}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={bottomRef}></div>

            </div>


            {/* Input */}

            <div className="flex gap-2 p-3 border-t bg-white">

                <input
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key==="Enter") sendMessage()
                }}
                placeholder="Ask anything..."
                className="flex-1 border rounded-full px-3 py-2 outline-none"
                />

                <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-5 rounded-full hover:bg-blue-700">
                    Send
                </button>

            </div>

        </div>
    )
}