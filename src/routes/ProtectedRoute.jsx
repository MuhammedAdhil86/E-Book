import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useBookStore } from "../store/useBookStore";
import Loader from "../component/loader"; // A simple loading spinner component

export default function ProtectedRoute({
  children,
  redirectIfNotAuth = true,
  redirectToIfUnauthenticated = null,
  requireSubscription = true,
}) {
  const {
    isAuthenticated,
    subscriptionType,
    user,
  } = useBookStore();

  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = setTimeout(() => setLoading(false), 200); // Simulated auth check
    return () => clearTimeout(check);
  }, []);

  if (loading) return <Loader />;

  // 🔒 Not authenticated
  if (!isAuthenticated) {
    const redirectPath = redirectToIfUnauthenticated || (redirectIfNotAuth ? "/verse" : "/");
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  const currentPath = location.pathname;
  const isSubscriptionPage = currentPath === "/subscribe";
  const isRenewPage = currentPath === "/renew";

  const hasSubscription = user?.has_subscription;
  const type = user?.subscription_type?.toLowerCase();

  // 🔁 Expired subscription logic
  if (hasSubscription === false && type === "expired" && !isRenewPage) {
    return <Navigate to="/renew" replace />;
  }

  // 🎟️ Trial users can access /subscribe
  if (hasSubscription && type === "trial" && isSubscriptionPage) {
    return children;
  }

  // 🛑 Paid users trying to access /subscribe
  if (hasSubscription && type === "paid" && isSubscriptionPage) {
    return <Navigate to="/subscribed" replace />;
  }

  // ✅ All good
  return children;
}
