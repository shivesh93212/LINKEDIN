import React , {useState,useEffect} from "react"
import { sendConnectionRequest,acceptConnection,rejectConnection,getConnectionStatus } from "../api/connectionApi"





function ConnectionButton({profileUserId}){

    const [status,setStatus]=useState("none")
    const [requestId,setRequestId]=useState(null)
    const [loading , setLoading] = useState(false)

    
    useEffect(()=>{
        loadStatus()
    },[profileUserId])

    const loadStatus=async ()=>{
        try{
            const res= await getConnectionStatus(profileUserId)
            setStatus(res.status)

            if(res.request_id){
                setRequestId(res.request_id)
            }
        }
        catch(err){
            console.log(err)
        }
    }
    

    const handleSend= async ()=>{
        setLoading(true)
        await sendConnectionRequest(profileUserId)
        setStatus("pending")
        setLoading(false)
    }

    const handleAccept = async ()=>{
        setLoading(true)
        await acceptConnection(requestId)
        setStatus("accepted")
        setLoading(false)
    }

    const handleReject= async ()=>{
        setLoading(true)
        await rejectConnection(requestId)
        setStatus("rejected")
        setLoading(false)
    }

    if(status==="accepted"){
        return (
            <button
            className="px-4 py-1 border rounded-full text-green-600 border-green-600">
                Connected
            </button>
        )
    }

    if(status==="pending"){
        return (
            <button
            className="px-4 py-1 border rounded-full text-gray-500">
                Requested
            </button>
        )
    }
    
    if(status==="received"){
        return (
            <div className="flex gap-2">
             <button
             onClick={handleAccept}
             disabled={loading}
             className="px-4 py-1 bg-blue-600 text-white rounded-full"
             >
                Accept
             </button>

             <button
             onClick={handleReject}
             disabled={loading}
             className="px-4 py-1 border border-gray-400 rounded-full"
             >
                Reject
             </button>
            </div>
        )
    }

    return (
        <button
        onClick={handleSend}
        disabled={loading}
        className="px-4 py-1 bg-blue-600 text-white rounded-full"
        >
            Connect
        </button>
    )

}

export default ConnectionButton