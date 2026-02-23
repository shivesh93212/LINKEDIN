import React , {useState,useEffect} from "react"

function ConnectionButton({profileUserId}){

    const [status,setStatus]=useState("none")
    const [requestId,setRequestId]=useState(null)

    useEffect(() => {

        const fetchStatus = async () => {
            try {

                const res = await fetch(
                    `http://127.0.0.1:8000/connections/status/${profileUserId}`,
                    { credentials: "include" }
                );

                if (!res.ok) {
                    setStatus("none");
                    return;
                }

                const data = await res.json();

                setStatus(data.status || "none");

                if (data.request_id) {
                    setRequestId(data.request_id);
                }

            } catch (err) {
                console.log("Status fetch error:", err);
                setStatus("none");
            }
        };

        if (profileUserId) {
            fetchStatus();
        }

    }, [profileUserId]);


    // ✅ SEND CONNECTION
    const handleSendRequest = async ()=>{
        try{
            await fetch(
                `http://127.0.0.1:8000/connections/send/${profileUserId}`,
                {
                    method:"POST",
                    credentials:"include"
                }
            )

            setStatus("pending")

        } catch(err){
            console.log("Send request error:",err)
        }
    }


    // ✅ ACCEPT CONNECTION
    const handleAccept = async ()=>{
        try{
            await fetch(
                `http://127.0.0.1:8000/connections/accept/${requestId}`,
                {
                    method:"POST",
                    credentials:"include"
                }
            )

            setStatus("accepted")

        } catch(err){
            console.log("Accept error:",err)
        }
    }


    // ✅ REJECT CONNECTION
    const handleReject = async ()=>{
        try{
            await fetch(
                `http://127.0.0.1:8000/connections/reject/${requestId}`,
                {
                    method:"POST",
                    credentials: "include"
                }
            )

            setStatus("none")

        } catch(err){
            console.log("Reject error" , err)
        }
    }


    return (
        <div>

            {status==="none" && (
                <button
                    onClick={handleSendRequest}
                    className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition"
                >
                    Connect
                </button>
            )}

            {status==="pending" && (
                <button
                    disabled
                    className="border px-4 py-1 rounded-full text-gray-600"
                >
                    Pending
                </button>
            )}

            {status ==="received" && (
                <div className="flex gap-2">
                    <button
                        onClick={handleAccept}
                        className="bg-blue-600 text-white px-4 py-1 rounded-full"
                    >
                        Accept
                    </button>

                    <button
                        onClick={handleReject}
                        className="border px-4 py-1 rounded-full"
                    >
                        Reject
                    </button>
                </div>
            )}

            {status==="accepted" && (
                <button
                    disabled
                    className="border px-4 py-1 rounded-full text-green-600"
                >
                    Connected
                </button>
            )}

        </div>
    )
}

export default ConnectionButton