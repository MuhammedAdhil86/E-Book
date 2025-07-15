import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useBookStore } from '../store/useBookStore';
import { Icon } from '@iconify/react';
import { mobileMenuVariants, searchBarVariants } from '../animations/navbarAnimation';

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
    { name: 'HOME', icon: <Icon icon="solar:home-linear" className="text-xl" />, link: '/' },
    { name: 'My E Books', icon: <Icon icon="solar:book-linear" className="text-xl" />, link: '#' },
    { name: 'Library', icon: <Icon icon="material-symbols:library-books-outline" className="text-xl" />, link: '/library' },
    { name: 'Notification', icon: <Icon icon="solar:bell-outline" className="text-xl" />, link: '#' },
    { name: 'Subscription', icon: <Icon icon="mdi:wallet-membership" className="text-xl" />, link: '/subscription' },
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
        const filtered = books.filter((book) =>
          book.title.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error('Search Error:', err);
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
                <Icon icon="solar:logout-outline" className="text-xl" />
                Logout
              </button>
            ) : (
              <Link
                to="/verse"
                className="flex items-center gap-2 text-sm font-medium hover:text-yellow-600"
              >
                <Icon icon="solar:login-outline" className="text-xl" />
                Login
              </Link>
            )}

            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Icon icon="solar:magnifer-linear" className="text-lg" />
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Icon icon="solar:magnifer-linear" className="text-2xl" />
            </button>
            <button onClick={() => setIsMobileOpen(true)}>
              <Icon icon="solar:hamburger-menu-linear" className="text-2xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && !isMobileOpen && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={searchBarVariants}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-nav"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={mobileMenuVariants}
            transition={mobileMenuVariants.transition}
            className="fixed inset-0 z-50 bg-white px-6 pt-20 pb-10 overflow-y-auto"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-6 right-6 text-gray-800"
            >
              <FaTimes size={24} />
            </button>

            <div className="flex flex-col gap-3 items-start pt-4">
              <div className="text-lg font-bold text-gray-800 pb-4 border-b w-full text-center">
                Motor Vehicle Law
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.link}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-4 text-base py-2 border-b w-full"
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
                  className="flex items-center gap-4 text-base py-2 w-full hover:text-red-600"
                >
                  <Icon icon="solar:logout-outline" className="text-xl" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/verse"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-4 text-base py-2 w-full hover:text-yellow-600"
                >
                  <Icon icon="solar:login-outline" className="text-xl" />
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
