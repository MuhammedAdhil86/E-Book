import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { BsBookmarkHeart, BsBook } from "react-icons/bs";
import { PiBooksFill } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineSubscriptions, MdOutlineSettings } from "react-icons/md";
import { Search } from "lucide-react";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { name: "My BookMarks", icon: <BsBookmarkHeart size={20} /> },
    { name: "My E Books", icon: <BsBook size={20} /> },
    { name: "Library", icon: <PiBooksFill size={20} /> },
    { name: "Notification", icon: <IoMdNotificationsOutline size={20} /> },
    { name: "Subscription", icon: <MdOutlineSubscriptions size={20} /> },
    { name: "Settings", icon: <MdOutlineSettings size={20} /> },
  ];

  const mobileNavVariants = {
    hidden: { opacity: 0, y: -60, transition: { duration: 0.4, ease: 'easeInOut' } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4, ease: 'easeInOut' } },
  };

  return (
    <>
      {!isMobileOpen && (
        <nav className="fixed inset-x-0 top-0 z-50 bg-white text-black border-b border-gray-200 shadow-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            {/* Logo */}
            <div className="text-xl font-bold uppercase tracking-widest">
              Motor Vehicle Law
            </div>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600"
                  >
                    {link.icon}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search Icon */}
              <button
                className="text-black hidden md:inline-flex"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={24} />
              </button>

              {/* Mobile Search & Menu Icons */}
              <div className="md:hidden flex items-center space-x-4">
                <button
                  className="text-black"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Search size={24} />
                </button>
                <button
                  className="text-black z-50"
                  onClick={() => setIsMobileOpen(true)}
                >
                  <Menu size={26} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Search Bar (Desktop and Mobile) */}
      <AnimatePresence>
        {isSearchOpen && !isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[72px] w-full bg-gray-100 text-gray-900 p-4 flex justify-center z-40"
          >
            <input
              type="text"
              placeholder="Search for items..."
              className="w-3/4 p-2 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Fullscreen Nav */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobileNav"
            variants={mobileNavVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-gray-100 flex flex-col justify-center items-center px-6 space-y-6"
          >
            <button
              className="absolute top-6 right-6 text-black"
              onClick={() => setIsMobileOpen(false)}
            >
              <FaTimes size={26} />
            </button>

            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href="#"
                className="flex items-center gap-3 px-4 py-2 text-lg font-semibold text-black hover:text-gray-600 transition"
                onClick={() => setIsMobileOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.icon}
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
