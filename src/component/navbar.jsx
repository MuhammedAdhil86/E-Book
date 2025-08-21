import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useBookStore } from "../store/useBookStore";
import MobileNavbar from "../responsive/navbarmobile"; // ✅ import split component
import Confirm from "../ui/conform"; // ✅ confirmation modal

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ confirm state
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = useBookStore((s) => s.isAuthenticated);
  const logout = useBookStore((s) => s.logout);

  // ✅ final logout handler
  const handleLogout = () => {
    logout();
    toast.success("Logout successful");
    navigate("/");
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Library", href: "/library" },
    { label: "My Bookmarks", href: "/bookmark" },
    { label: "Subscription", href: "/subscription" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-[#fcf6f1] py-4 fixed inset-x-0 top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link to="/" className="text-lg font-serifTitle text-gray-900">
            Motor Vehicles Law
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, idx) => (
              <React.Fragment key={item.label}>
                <Link
                  to={item.href}
                  className={`relative text-sm px-1 py-1 transition duration-300
                    ${
                      location.pathname === item.href
                        ? "text-black font-semibold"
                        : "text-gray-800"
                    } hover:text-black
                    before:content-[''] before:absolute before:bottom-0 before:left-0
                    before:h-[2px] before:bg-black before:transition-all before:duration-300
                    before:w-0 hover:before:w-full
                    ${location.pathname === item.href ? "before:w-full" : ""}
                  `}
                >
                  {item.label}
                </Link>
                {idx < navItems.length - 1 && (
                  <span className="text-gray-400">|</span>
                )}
              </React.Fragment>
            ))}

            <span className="text-gray-400">|</span>

            {/* Auth buttons styled same as navItems with icons */}
            {isAuthenticated ? (
              <button
                onClick={() => setShowConfirm(true)} // ✅ show confirm
                className={`flex items-center gap-2 relative text-sm px-3 py-1 
                  transition duration-300 hover:text-red-500 hover:border-yellow-500
                  before:content-[''] before:absolute before:bottom-0 before:left-0
                  before:h-[2px] before:transition-all before:duration-300
                  before:w-0 hover:before:w-full
                `}
              >
                <FiLogOut size={16} className="hover:text-red-500" />
              </button>
            ) : (
              <Link
                to="/verse"
                className={`flex items-center gap-2 relative text-sm px-3 py-1 
                  transition duration-300 hover:text-yellow-500 hover:border-yellow-500
                  before:content-[''] before:absolute before:bottom-0 before:left-0
                  before:h-[2px] before:transition-all before:duration-300
                  before:w-0 hover:before:w-full
                `}
              >
                <FiLogIn size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-800"
            onClick={() => setIsMobileOpen(true)}
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-gray-800" />
              <span className="block w-6 h-0.5 bg-gray-800" />
              <span className="block w-6 h-0.5 bg-gray-800" />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <MobileNavbar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        navItems={navItems}
        isAuthenticated={isAuthenticated}
        handleLogout={() => setShowConfirm(true)} // ✅ show confirm in mobile too
      />

      {/* ✅ Confirm Modal */}
      <Confirm
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        message="Are you sure you want to logout?"
      />
    </>
  );
}
