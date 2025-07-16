import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Me", href: "/about" },
    { label: "Books", href: "/books" },
    { label: "Podcast", href: "/podcast" },
    { label: "Contact", href: "/contact" },
  ];

  const mobileMenuVariants = {
    hidden: { y: "-100vh" },
    visible: {
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
    exit: {
      y: "-100vh",
      transition: { when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-[#fcf6f1] py-4 fixed inset-x-0 top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-lg font-serifTitle text-gray-900">Sonali Dev</Link>
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, idx) => (
              <React.Fragment key={item.label}>
                <Link to={item.href} className="text-sm text-gray-800 hover:text-black tracking-wide">
                  {item.label}
                </Link>
                {idx < navItems.length - 1 && <span className="text-gray-400">|</span>}
              </React.Fragment>
            ))}
          </div>
          <button
            className="lg:hidden p-2 text-gray-800"
            onClick={() => setIsMobileOpen(true)}
          >
            {/* Hamburger icon */}
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-gray-800" />
              <span className="block w-6 h-0.5 bg-gray-800" />
              <span className="block w-6 h-0.5 bg-gray-800" />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Full-screen Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#fcf6f1]  flex flex-col"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setIsMobileOpen(false)} className="text-gray-800">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="text-center font-serifTitle text-xl mb-4">Sonali Dev</div>
            <div className="border-b mx-6 mb-6" />
            <nav className="flex flex-col gap-4 px-6">
              {navItems.map(item => (
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
