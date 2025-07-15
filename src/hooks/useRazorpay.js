import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useBookStore } from "../store/useBookStore";

export const useRazorpayHandler = () => {
  const { user, updateSubscriptionState } = useBookStore();
  const navigate = useNavigate();

  const handleRazorpay = (plan) => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: plan.price * 100,
      currency: "INR",
      name: "Motor Law App",
      description: plan.name,
      image: "/logo.png",
      handler: function (response) {
        toast.success("✅ Payment successful!");
        updateSubscriptionState({
          ...user,
          has_subscription: true,
          subscription_type: plan.name,
        });

        navigate("/invoice", {
          state: { payment: response, plan, user },
        });
      },
      prefill: {
        name: user?.first_name || "User",
        email: user?.email || "email@example.com",
        contact: user?.mobile?.replace("+91", "") || "9999999999",
      },
      notes: {
        plan_name: plan.name,
        user_id: user?.id || "N/A",
      },
      theme: { color: "#facc15" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return { handleRazorpay };
};
