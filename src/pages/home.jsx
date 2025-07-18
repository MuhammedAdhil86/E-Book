// src/pages/Home.jsx
import React, { useEffect } from "react";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import BooksSection from "../component/bookssection";
import InfoPart from "../component/info";
import { useNotificationStore } from "../store/useToastStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "../component/landingpage";

const Home = () => {
  const { message, type, clearNotification } = useNotificationStore();

  useEffect(() => {
    if (message) {
      if (type === "success") toast.success(message);
      else if (type === "error") toast.error(message);
      else toast.info(message);
      clearNotification();
    }
  }, [message]);

  return (
    <div className="overflow-hidden">
      <ToastContainer position="top-center" />
      <Navbar />
      <LandingPage/>
      <InfoPart />
      <BooksSection />
      <Footer />
    </div>
  );
};

export default Home;
