// src/components/ToastListener.jsx
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNotificationStore } from "../store/useToastStore";

export default function ToastListener() {
  const { message, type, clearNotification } = useNotificationStore();

  useEffect(() => {
    if (message) {
      console.log("🔥 ToastListener triggered:", message);
      toast[type](message); // toast.success("msg") or toast.error("msg")
      clearNotification();  // Reset store after showing
    }
  }, [message, type, clearNotification]);

  return null;
}
