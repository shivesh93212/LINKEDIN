import axiosInstance from "./axiosInstance"

// get all notifications
export const getNotificationApi = async () => {
  const res = await axiosInstance.get("/notifications/")
  return res.data
}

// mark all read
export const markAllReadApi = async () => {
  const res = await axiosInstance.post("/notifications/mark-all-read")
  return res.data
}

// unread count
export const getUnreadCountApi = async () => {
  const res = await axiosInstance.get("/notifications/unread-count")
  return res.data
}