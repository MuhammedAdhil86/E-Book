import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

import { useBookStore } from "../../store/useBookStore";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const isAuthenticated = useBookStore((s) => s.isAuthenticated);
  const logout = useBookStore((s) => s.logout);
  const subscriptionType = useBookStore((s) => s.subscriptionType);

  const handleLogout = () => {
    logout();
    toast.success("Logout successful ");
    navigate("/");
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Library", href: "/library" },
    { label: "About Us", href: "/about" },
    { label: "Subscription", href: "/subscription" },
  ];

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get('https://mvdapi-mxjdw.ondigitalocean.app/api/ebook/covers');
        const books = res.data.responsedata || [];
        const filtered = books.filter(book =>
          book.title.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error('Search Error:', err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const mobileMenuVariants = {
    hidden: { y: "-100vh" },
    visible: { y: 0, transition: { when: "beforeChildren", staggerChildren: 0.1 } },
    exit: { y: "-100vh", transition: { when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  };

  const searchBarVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#fcf6f1] py-4 fixed inset-x-0 top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-lg font-serifTitle text-gray-900">Motor Vehicles Law</Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, idx) => (
              <React.Fragment key={item.label}>
                <Link to={item.href} className="text-sm text-gray-800 hover:text-black">
                  {item.label}
                </Link>
                {idx < navItems.length - 1 && <span className="text-gray-400">|</span>}
              </React.Fragment>
            ))}

            <span className="text-gray-400">|</span>

            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-sm text-gray-800 hover:text-red-600">
                Logout
              </button>
            ) : (
              <Link to="/verse" className="text-sm text-gray-800 hover:text-black">
                Login
              </Link>
            )}

            <button onClick={() => setIsSearchOpen(o => !o)} className="p-1 text-gray-800">
              <Icon icon="solar:magnifer-linear" className="text-lg" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 text-gray-800" onClick={() => setIsMobileOpen(true)}>
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-gray-800" />
              <span className="block w-6 h-0.5 bg-gray-800" />
              <span className="block w-6 h-0.5 bg-gray-800" />
            </div>
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && !isMobileOpen && (
          <motion.div
            key="search-bar"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={searchBarVariants}
            className="fixed top-[64px] inset-x-0 bg-[#fcf6f1] z-40 px-4 py-4"
          >
            <div className="max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Search books..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full px-3 py-2 rounded border focus:ring-2 focus:ring-yellow-500"
              />
              {suggestions.length > 0 && (
                <ul className="mt-2 bg-white border rounded shadow text-sm">
                  {suggestions.map(book => (
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

      {/* Mobile Menu */}
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
              <button onClick={() => setIsMobileOpen(false)} className="text-gray-800">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="text-center font-serifTitle text-xl mb-4">Motor Vehicles Law</div>
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
              <motion.div variants={itemVariants}>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileOpen(false);
                    }}
                    className="text-base text-gray-800 py-2 border-b w-full text-left"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/verse"
                    onClick={() => setIsMobileOpen(false)}
                    className="text-base text-gray-800 py-2 border-b block"
                  >
                    Login
                  </Link>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
