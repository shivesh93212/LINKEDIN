import { useEffect, useState } from "react";
import {
  getRequests,
  getConnections,
  acceptConnection,
  rejectConnection,
} from "../api/connectionApi";
import { Link } from "react-router-dom";

import { getProfileImage } from "../config";
import { useNavigate } from "react-router-dom";


export default function Network() {

  const navigate=useNavigate()

  const [request, setRequest] = useState([]);
  const [connection, setConnection] = useState([]);

  const loadData = async () => {
    const req = await getRequests();
    const con = await getConnections();


     console.log(req.data[0]?.sender);
     console.log(req);


    setRequest(req.data);
    setConnection(con.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReject = async (id) => {
    await rejectConnection(id);
    setRequest((prev)=>prev.filter((r)=>r.id!==id))
    // loadData();
  };

  const handleAccept = async (id) => {
    // await acceptConnection(id);
    const res=await acceptConnection(id)
    setRequest((prev)=>prev.filter((r)=>r.id!==id))
    
    setConnection((prev)=>[...prev,res.data])
    // loadData();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* page title */}
      <div className="flex items-center gap-3 mb-6">

  <button
    onClick={()=>navigate(-1)}
    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 transition"
  >
    ←
  </button>

  <h1 className="text-2xl font-bold">
    My Network
  </h1>

</div>

      {/* notification banner */}
      {request.length > 0 && (
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg mb-6">
          🔔 You have {request.length} new connection request
        </div>
      )}

      <div className="bg-white shadow rounded-lg px-2 py-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>

        {request.length === 0 && (
          <p className="text-gray-500">No Pending requests</p>
        )}

        {request.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between border-b py-3"
          >
            <Link to={`/profile/${request.sender?.id}`}>
           <div className="flex items-center gap-3">
          <img
            src={req.sender?.profile_photo || }
            className="w-10 h-10 rounded-full"
            />

           <p className="font-medium">{req.sender?.name || "https://via.placeholder.com/150"}</p>
             </div>
             </Link>

            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(req.id)}
                className="bg-green-600  text-white px-3 py-[6px] rounded-full hover:bg-green-700"
              >
                ✓
              </button>

              <button
                onClick={() => handleReject(req.id)}
                className="bg-red-600 text-white border px-3 py-[6px] rounded-full hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}