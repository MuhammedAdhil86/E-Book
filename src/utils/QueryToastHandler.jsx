// src/component/QueryToastHandler.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const QueryToastHandler = () => {
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const login = params.get("login");
    const logout = params.get("logout");
    const signup = params.get("signup");

    if (login === "success") toast.success("Logged in successfully!");
    if (logout === "success") toast.success("Logged out successfully!");
    if (signup === "success") toast.success("Account created successfully!");

    // Remove query params from URL after displaying toast
    if (login || logout || signup) {
      params.delete("login");
      params.delete("logout");
      params.delete("signup");

      const newQuery = params.toString();
      const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ""}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [search]);

  return null;
};

export default QueryToastHandler;

