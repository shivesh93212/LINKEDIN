import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificationApi, markAllReadApi } from "../api/notificationApi";
import { ArrowLeft } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔥 time ago function
  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);

    const intervals = [
      { label: "y", seconds: 31536000 },
      { label: "mo", seconds: 2592000 },
      { label: "d", seconds: 86400 },
      { label: "h", seconds: 3600 },
      { label: "m", seconds: 60 },
      { label: "s", seconds: 1 },
    ];

    for (let i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count > 0) return `${count}${i.label} ago`;
    }

    return "just now";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getNotificationApi();
        setNotifications(data || []);

        await markAllReadApi();
      } catch (err) {
        console.log("Notification error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <div className="max-w-xl mx-auto bg-white shadow-sm md:mt-6 md:rounded-lg">

        {/* HEADER */}
        <div className="flex items-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded hover:bg-gray-200"
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-lg font-semibold text-gray-800">
            Notifications
          </h2>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500 py-6">
            Loading notifications...
          </p>
        )}

        {/* EMPTY */}
        {!loading && notifications.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No notifications
          </p>
        )}

        {/* LIST */}
        {!loading &&
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => navigate(`/post/${n.reference_id}`)}
              className="flex items-start justify-between gap-3 p-4 border-b hover:bg-gray-50 cursor-pointer transition"
            >
              {/* LEFT */}
              <div className="flex items-start gap-3">
                <img
                  src={
                    n.actor?.profile_photo ||
                    "https://res.cloudinary.com/dlpxi5foo/image/upload/w_150,h_150,c_fill,f_auto,q_auto/dummy_image_nxvwnc"
                  }
                  alt="user"
                  className="w-11 h-11 rounded-full object-cover border"
                />

                <div>
                  <p className="text-sm text-gray-800 leading-snug">
                    <span className="font-semibold">
                      {n.actor?.name || "Someone"}
                    </span>{" "}
                    posted something
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Tap to view post
                  </p>
                </div>
              </div>

              {/* RIGHT TIME */}
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {timeAgo(n.created_at)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}