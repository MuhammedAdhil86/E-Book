import React, { useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom"; 
import { useBookStore } from "../store/useBookStore"; 
import toast from "react-hot-toast";
import Confirm from "../ui/conform"; // ✅ import modal

export default function Settings() {
  const navigate = useNavigate(); 
  const logout = useBookStore((state) => state.logout);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ state for modal

  const sections = [
    {
      title: "Account & Preferences",
      items: [
        { label: "Language Preferences" },
        { label: "State Preferences" },
        { label: "Update Profile" },
        { label: "Logout", danger: true },
      ],
    },
    {
      title: "Library & Subscription",
      items: [
        { label: "Delete my eBooks" },
        { label: "Subscription" },
      ],
    },
    {
      title: "Info & Policies",
      items: [
        { label: "Payment Policy" },
        { label: "Terms & Conditions" },
        { label: "Privacy Policy" },
        { label: "Disclaimer" },
        { label: "About Us", link: "/about" }, // ✅ use router link here
      ],
    },
  ];

  // ✅ handle actual logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-md border-r">
        <div className="p-6 text-xl font-bold border-b ">Settings</div>
        <nav className="flex flex-col p-4 space-y-2">
          {sections.map((section, idx) => (
            <a
              key={idx}
              href={`#${section.title.replace(/\s+/g, "-")}`}
              className="text-gray-700 text-sm font-medium hover:text-yellow-600 transition"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-2 p-4 border-b bg-white">
          <FiChevronLeft
            className="text-2xl cursor-pointer"
            onClick={() => navigate(-1)} 
          />
          <h1 className="text-lg font-semibold ml-2">Settings</h1>
        </div>

        {/* Settings Content */}
        <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} id={section.title.replace(/\s+/g, "-")} className="space-y-4">
              <h2 className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
                {section.title}
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {section.items.map((item, i) =>
                  item.link ? (
                    // ✅ Special case for "About Us" (or any item with link)
                    <Link
                      key={i}
                      to={item.link}
                      className="flex items-center px-4 py-3 rounded-lg border shadow-sm transition cursor-pointer text-gray-800 bg-white hover:bg-yellow-200"
                    >
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  ) : (
                    <div
                      key={i}
                      onClick={
                        item.label === "Logout"
                          ? () => setShowConfirm(true)
                          : undefined
                      }
                      className={`flex items-center px-4 py-3 rounded-lg border shadow-sm transition cursor-pointer 
                        ${item.danger 
                          ? "text-red-500 font-medium bg-white hover:bg-red-100" 
                          : "text-gray-800 bg-white hover:bg-yellow-200"
                        }`}
                    >
                      <span className="text-sm">{item.label}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ✅ Confirm Modal */}
      <Confirm
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        message="Are you sure you want to logout?"
      />
    </div>
  );
}
