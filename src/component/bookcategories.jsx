import React, { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/Instance';
import { fadeContainer, fadeItem } from '../animations/categoryAnimation';

const bgClasses = ['bg-purple-50', 'bg-yellow-50', 'bg-red-50', 'bg-cyan-50', 'bg-pink-50'];

const assignNonRepeatingColors = (categories, colors) => {
  const assigned = [];
  let lastColor = null;
  for (let i = 0; i < categories.length; i++) {
    const availableColors = colors.filter((color) => color !== lastColor);
    const color = availableColors[Math.floor(Math.random() * availableColors.length)];
    assigned.push({ ...categories[i], bg: color });
    lastColor = color;
  }
  return assigned;
};

const BookCategories = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [coloredCategories, setColoredCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all'); // ✅ Track selected category

  // Fetch categories
  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        const fetched = res.data || [];
        const allCategory = { id: 'all', name: 'All Categories' };
        const fullList = [allCategory, ...fetched];
        setCategories(fullList);
      })
      .catch((err) => console.error(err));
  }, []);

  // Assign colors based on view state
  useEffect(() => {
    const visible = viewAll ? categories : categories.slice(0, 5);
    const colored = assignNonRepeatingColors(visible, bgClasses);
    setColoredCategories(colored);
  }, [viewAll, categories]);

  // Handle click
  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id); // ✅ Update internal state
    if (typeof onCategorySelect === 'function') {
      onCategorySelect(id); // ✅ Send to parent
    }
  };

  return (
    <div className="px-[60px] mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
        <button
          onClick={() => setViewAll(!viewAll)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-all"
        >
          {viewAll ? 'Close All' : 'View All'} <span className="text-lg">&rarr;</span>
        </button>
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
        variants={fadeContainer}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <AnimatePresence>
          {coloredCategories.map((cat, idx) => (
            <motion.div
              key={cat.id || idx}
              onClick={() => handleCategoryClick(cat.id)}
              className={`
                ${cat.bg} 
                cursor-pointer rounded-md p-4 flex flex-col items-center justify-center text-center shadow-sm 
                hover:shadow-md transition
                ${selectedCategoryId === cat.id ? 'ring-2 ring-gray-700' : ''}
              `}
              variants={fadeItem}
              layout
            >
              <FaBook className="text-2xl text-gray-900" />
              <p className="mt-2 text-sm font-medium text-gray-800">{cat.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {cat.id === 'all' ? 'Browse All' : 'Shop Now'}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BookCategories;
