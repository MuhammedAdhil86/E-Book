import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiLogIn, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import Confirm from "../ui/conform"; // ✅ import Confirm

export default function MobileNavbar({
  isMobileOpen,
  setIsMobileOpen,
  navItems,
  isAuthenticated,
  handleLogout,
}) {
  const [showConfirm, setShowConfirm] = useState(false); // ✅ confirm state

  const mobileMenuVariants = {
    hidden: { y: "-100vh" },
    visible: {
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
    exit: {
      y: "-100vh",
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  };

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#fcf6f1] flex flex-col"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-gray-800"
              >
                <FiX size={28} />
              </button>
            </div>
            <div className="text-center font-serifTitle text-xl mb-4">
              Motor Vehicles Law
            </div>
            <div className="border-b mx-6 mb-6" />
            <nav className="flex flex-col gap-4 px-6">
              {navItems.map((item) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <Link
                    to={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-base text-gray-800 py-2 border-b block"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={itemVariants}>
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowConfirm(true)} // ✅ open confirm modal
                    className="flex items-center gap-2 text-base text-gray-800 py-2 border-b w-full text-left hover:text-red-600"
                  >
                    <FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/verse"
                    onClick={() => setIsMobileOpen(false)}
                    className=" items-center gap-2 text-base text-gray-800 py-2 border-b block hover:text-yellow-500"
                  >
                    <FiLogIn size={20} />
                    <span>Login</span>
                  </Link>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Confirm Modal */}
      <Confirm
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          handleLogout();
          setIsMobileOpen(false); // close menu after logout
        }}
        message="Are you sure you want to logout?"
      />
    </>
  );
}
