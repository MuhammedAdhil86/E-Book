import React from 'react';
import { FaCamera, FaUtensils, FaHeart, FaStethoscope, FaBook } from 'react-icons/fa';

const categories = [
  {
    title: 'Arts & Photography',
    icon: <FaCamera className="text-purple-500 text-2xl" />,
    bg: 'bg-purple-50',
  },
  {
    title: 'Food & Drink',
    icon: <FaUtensils className="text-yellow-500 text-2xl" />,
    bg: 'bg-yellow-50',
  },
  {
    title: 'Romance',
    icon: <FaHeart className="text-red-500 text-2xl" />,
    bg: 'bg-red-50',
  },
  {
    title: 'Health',
    icon: <FaStethoscope className="text-cyan-500 text-2xl" />,
    bg: 'bg-cyan-50',
  },
  {
    title: 'Biography',
    icon: <FaBook className="text-pink-500 text-2xl" />,
    bg: 'bg-pink-50',
  },
];

const BookCategories = () => {
  return (
    <div className="px-[60px] mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Featured Categories</h2>
        <a href="#" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          All Categories <span className="text-lg">&rarr;</span>
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className={`${cat.bg} rounded-md p-4 flex flex-col items-center justify-center text-center transition hover:shadow-md`}>
            {cat.icon}
            <p className="mt-2 text-sm font-medium text-gray-800">{cat.title}</p>
            <p className="text-xs text-gray-500 mt-1">Shop Now</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCategories;
