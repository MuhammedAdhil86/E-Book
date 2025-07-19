import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useBookStore } from "../store/useBookStore"; // ✅ Import Zustand store

export default function NewRelease() {
  const { search } = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = useBookStore((state) => state.isAuthenticated);
  const subscriptionType = useBookStore((state) => state.subscriptionType);
  const hasSubscription = useBookStore((state) => state.hasSubscription);

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("login") === "success") {
      toast.success("Logged in successfully!");
      params.delete("login");
      window.history.replaceState({}, "", `${window.location.pathname}`);
    }
  }, [search]);

  const handleExplore = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!hasSubscription || subscriptionType === "trial" || subscriptionType === "expired") {
      navigate("/subscription");
    } else {
      navigate("/library");
    }
  };

  return (
    <div className="bg-[#fcf6f1] lg:min-h-screen flex flex-col items-center px-6 font-serif pb-6">
      {/* Title */}
      <h1 className="mt-16 text-[48px] md:text-[64px] lg:text-[84px] font-light leading-none tracking-wide font-serifTitle text-center md:text-left">
        NEW RELEASE
      </h1>
      {/* Bottom Section */}
      <div className="md:mt-6 w-full max-w-7xl flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-0">
        {/* LEFT: Text */}
        <div className="w-full md:w-1/3 text-center md:text-left">
          <p className="text-[18px] md:text-[26px] text-black leading-snug">MOTOR VEHICLES</p>
          <p className="text-[18px] md:text-[26px] text-[#f2c94c] font-semibold leading-snug">
            LAW PORTAL
          </p>
          <p className="text-[18px] md:text-[26px] text-black leading-snug">AUTHOR</p>
        </div>
        {/* CENTER: Book Image */}
        <div className="w-full md:w-1/3 flex justify-center relative">
          <img
            src="https://m.media-amazon.com/images/I/91KMWKklBNL.jpg"
            alt="New Release Cover"
            className="w-40 md:w-[280px] h-auto shadow-lg"
          />
        </div>
        {/* RIGHT: Description & Button */}
        <div className="w-full md:w-1/3 text-center md:text-left flex flex-col items-center md:items-start">
          <p className="text-[14px] md:text-[15px] leading-relaxed text-black w-full md:w-[260px]">
            The essential tool for legal professionals, researchers, and anyone navigating the Motor Vehicles Law of India. Stay updated. Stay empowered.
          </p>
          <button
            className="mt-4 md:mt-6 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium px-5 py-2"
            onClick={handleExplore} // ✅ Explore Button Handler
          >
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
}
