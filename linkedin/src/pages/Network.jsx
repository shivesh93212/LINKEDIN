import { useEffect, useState } from "react";
import {
  getRequests,
  getConnections,
  acceptConnection,
  rejectConnection,
} from "../api/connectionApi";


export default function Network() {
  const [request, setRequest] = useState([]);
  const [connection, setConnection] = useState([]);

  const loadData = async () => {
    const req = await getRequests();
    const con = await getConnections();

    setRequest(req.data);
    setConnection(con.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReject = async (id) => {
    await rejectConnection(id);
    loadData();
  };

  const handleAccept = async (id) => {
    await acceptConnection(id);
    loadData();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* page title */}
      <h1 className="text-2xl font-bold mb-6">My Network</h1>

      {/* notification banner */}
      {request.length > 0 && (
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg mb-6">
          🔔 You have {request.length} new connection request
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>

        {request.length === 0 && (
          <p className="text-gray-500">No Pending requests</p>
        )}

        {request.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between border-b py-3"
          >
            <div>
              <p className="font-medium">User ID: {req.sender_id}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(req.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Accept
              </button>

              <button
                onClick={() => handleReject(req.id)}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}