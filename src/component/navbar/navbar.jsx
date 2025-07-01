import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, LogIn } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { BsBookmarkHeart, BsBook } from "react-icons/bs";
import { PiBooksFill } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineSubscriptions, MdOutlineSettings } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const navLinks = [
    { name: "My BookMarks", icon: <BsBookmarkHeart size={20} />, link: "#" },
    { name: "My E Books", icon: <BsBook size={20} />, link: "#" },
    { name: "Library", icon: <PiBooksFill size={20} />, link: "/library" },
    { name: "Notification", icon: <IoMdNotificationsOutline size={20} />, link: "#" },
    { name: "Subscription", icon: <MdOutlineSubscriptions size={20} />, link: "#" },
    { name: "Settings", icon: <MdOutlineSettings size={20} />, link: "#" },
    { name: "Login", icon: <LogIn size={20} />, link: "/verse" },
  ];

  const mobileNavVariants = {
    hidden: { opacity: 0, y: -60, transition: { duration: 0.4, ease: 'easeInOut' } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4, ease: 'easeInOut' } },
  };

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await axios.get("https://mvdapi-mxjdw.ondigitalocean.app/api/ebook/covers");
        const filtered = res.data.filter((book) =>
          book.title.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error("Search fetch error:", err);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <>
      {!isMobileOpen && (
        <nav className="fixed inset-x-0 top-0 z-50 bg-white text-black border-b border-gray-200 shadow-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div className="text-xl font-bold uppercase tracking-widest">
              Motor Vehicle Law
            </div>

            <ul className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    className="flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-4">
              <button
                className="text-black hidden md:inline-flex"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={24} />
              </button>

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

      {/* Search Bar with Suggestions */}
      <AnimatePresence>
        {isSearchOpen && !isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[72px] w-full bg-gray-100 text-gray-900 p-4 flex flex-col items-center z-40"
          >
            <input
              type="text"
              placeholder="Search for items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-3/4 p-2 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none"
            />

            {suggestions.length > 0 && (
              <ul className="w-3/4 bg-white border border-gray-300 mt-2 rounded shadow text-sm">
                {suggestions.map((book) => (
                  <li
                    key={book.id}
                    onClick={() => {
                      setQuery('');
                      setIsSearchOpen(false);
                      navigate(`/read/${book.id}`);
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {book.title}
                  </li>
                ))}
              </ul>
            )}
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
              <Link
                key={link.name}
                to={link.link}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-lg font-semibold text-black hover:text-gray-600 transition"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
