import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, LogIn, LogOut } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { BsBookmarkHeart, BsBook } from "react-icons/bs";
import { PiBooksFill } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineSubscriptions, MdOutlineSettings } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useBookStore } from '../store/useBookStore';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const isAuthenticated = useBookStore((s) => s.isAuthenticated);
  const logout = useBookStore((s) => s.logout);
  const subscriptionType = useBookStore((s) => s.subscriptionType);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: "My BookMarks", icon: <BsBookmarkHeart size={20} />, link: "#" },
    { name: "My E Books", icon: <BsBook size={20} />, link: "#" },
    { name: "Library", icon: <PiBooksFill size={20} />, link: "/library" },
    { name: "Notification", icon: <IoMdNotificationsOutline size={20} />, link: "#" },
    { name: "Subscription", icon: <MdOutlineSubscriptions size={20} />, link: "/subscription" },
    { name: "Settings", icon: <MdOutlineSettings size={20} />, link: "#" },
  ];

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get("https://mvdapi-mxjdw.ondigitalocean.app/api/ebook/covers");
        const books = res.data.responsedata || [];
        const filtered = books.filter((book) =>
          book.title.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error("Search Error:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-white text-black border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <div className="text-lg sm:text-xl font-bold tracking-wider">
            Motor Vehicle Law
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.link}
                className="flex items-center gap-2 text-sm font-medium hover:text-yellow-600"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium hover:text-red-600"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <Link
                to="/verse"
                className="flex items-center gap-2 text-sm font-medium hover:text-yellow-600"
              >
                <LogIn size={20} />
                Login
              </Link>
            )}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search size={20} />
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search size={22} />
            </button>
            <button onClick={() => setIsMobileOpen(true)}>
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSearchOpen && !isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed top-[64px] inset-x-0 bg-gray-100 z-40 px-4 py-4"
          >
            <div className="max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Search books..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-yellow-500"
              />

              {suggestions.length > 0 && (
                <ul className="mt-2 bg-white border rounded shadow text-sm">
                  {suggestions.map((book) => (
                    <li
                      key={book.id}
                      onClick={() => {
                        setQuery('');
                        setIsSearchOpen(false);
                        if (subscriptionType === 'pending') {
                          navigate('/subscribe');
                        } else {
                          navigate(`/read/${book.id}`);
                        }
                      }}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {book.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center pt-20 pb-10 space-y-6"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-6 right-6 text-gray-800"
            >
              <FaTimes size={24} />
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.link}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold hover:text-yellow-600"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-3 text-lg font-semibold hover:text-red-600"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <Link
                to="/verse"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold hover:text-yellow-600"
              >
                <LogIn size={20} />
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
