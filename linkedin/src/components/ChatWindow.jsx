import { getChat } from "../api/chatApi";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { ArrowLeft } from "lucide-react";

export default function ChatWindow({ user, back }) {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    loadMessages();
  }, [user]);

  const loadMessages = async () => {
    try {
      const data = await getChat(user.user_id);
      setMessages(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = () => {

    if (!text.trim()) return;

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {

      socketRef.current.send(
        JSON.stringify({
          type: "message",
          receiver_id: user.user_id,
          content: text
        })
      );

    }

    setText("");
  };

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return;

   const socket = new WebSocket(
  `wss://prolinker-zmjm.onrender.com/ws/chat?token=${token}`
);

    socketRef.current = socket;

    socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("WS:", data);

  if (data.type === "message") {

    setMessages(prev => {
      const exists = prev.some(m => m.id === data.id);
      if (exists) return prev;
      return [...prev, data];
    });

  }

  if (data.type === "seen") {

    setMessages(prev =>
      prev.map(msg =>
        msg.id === data.message_id
          ? { ...msg, is_read: true }
          : msg
      )
    );

  }
};

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };

  }, [user]);

  // send seen event
 useEffect(() => {

  if (!currentUser || !socketRef.current) return;

  const unread = messages.filter(
    msg =>
      msg.sender_id !== currentUser.id &&
      !msg.is_read
  );

  unread.forEach(msg => {

    socketRef.current.send(
      JSON.stringify({
        type: "seen",
        message_id: msg.id
      })
    );

  });

}, [messages]);
 

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(()=>{
    if(!user?.name && user?.user_id){
      fetch(`https://prolinker-zmjm.onrender.com/users/${user.user_id}`)
      .then(res=>res.json())
      .then(data=>{
        user.name=data.name
      })
    }
  },[user])


  return (
    <div className="flex flex-col h-full w-full">

      <div className="sticky top-0 z-10 p-3 border-b font-semibold bg-white flex items-center gap-3">

        <button
          onClick={back}
          className="md:hidden text-black text-[22px] font-semibold"
        >
          <ArrowLeft size={20} />
        </button>

        <p className="text-sm">{user.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
          />
        ))}

        <div ref={messagesEndRef}></div>

      </div>

      <div className="sticky bottom-0 flex p-3 border-t gap-2 bg-white">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter") handleSend()
          }}
          placeholder="Write message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>

      </div>

    </div>
  );
}