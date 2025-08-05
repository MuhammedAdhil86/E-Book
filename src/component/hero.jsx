// ✅ File: src/component/hero.jsx
import React from 'react';
import { useBookStore } from "../store/useBookStore";

const getUserFullName = (user) => {
  if (!user) return "Guest";
  if (user.name) return user.name;
  if (user.fullName) return user.fullName;
  const firstName = user.first_name || "";
  const lastName = user.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || "Guest";
};

const Hero = ({ keyword, setKeyword, onSearchButtonClick }) => {
  const user = useBookStore((state) => state.user);
  const userName = getUserFullName(user);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value); // live update
  };

  const handleSearchClick = () => {
    onSearchButtonClick(); // scroll only here
  };

  return (
    <div className="h-auto flex flex-col px-[60px] pt-[40px] pb-[20px] box-border mt-[85px] font-body">
      <div className="flex flex-col lg:flex-row justify-between items-center flex-1 min-h-0">
        <div className="max-w-[500px] w-full">
          <h4 className="text-lg text-gray-700 mb-2 font-serif">
            Welcome, {userName}
          </h4>

          <h1 className="text-[42px] font-serifTitle font-bold leading-[1.2] text-gray-900 mb-[16px]">
            Find the book <br />
            you’re looking for <br />
            <span className="text-gray-700">easier to read.</span>
          </h1>

          <p className="text-gray-500 text-[14px] mb-[24px] font-body">
            The most appropriate book site to reach books.
          </p>

          {/* Search Input */}
          <div className="relative w-96 h-[48px]">
            <input
              type="text"
              placeholder="Find your favorite book here..."
              value={keyword}
              onChange={handleInputChange}
              className="w-full h-full pl-4 pr-28 text-sm text-gray-700 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all font-body"
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-green-400 hover:bg-green-500 text-white px-4 py-1.5 text-sm font-medium rounded-full transition-colors font-body"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mt-10 lg:mt-0 flex-shrink-0 w-[600px] h-auto">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/066/552/627/small/stacked-books-in-various-colors-and-sizes-displayed-on-a-white-background-showcasing-literary-diversity-and-potential-for-learning-photo.jpg"
            alt="Stack of colorful books"
            className="w-full h-auto object-contain rounded-md shadow-sm"
            loading="lazy"
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-2 pt-4 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-300 text-[10px] font-body">
        <div className="flex-1 px-4 py-2">
          <p className="text-green-500 text-[12px] mb-[6px] font-serif">
            New Arrived
          </p>
          <p className="text-gray-800 font-semibold text-3xl font-serifTitle">
            Have you chosen a good book?
          </p>
        </div>
        <div className="flex-1 px-4 py-2">
          <p className="text-gray-400 text-[12px] mb-[6px] font-serif">
            Blog - 12/2/1
          </p>
          <p className="text-gray-800 font-semibold text-xl leading-snug font-serifTitle">
            Where do you want to go <br /> today? find it in a book
          </p>
        </div>
        <div className="flex-1 px-4 py-2">
          <p className="text-gray-400 text-[12px] mb-[6px] font-serif">
            Blog - 12/2/1
          </p>
          <p className="text-gray-800 font-semibold text-xl leading-snug font-serifTitle">
            Give the gift of love - <br /> read to someone
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
