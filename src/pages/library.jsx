// ✅ File: src/pages/Library.jsx
import React, { useRef, useState } from 'react';
import Navbar from "../component/navbar";
import Footer from '../component/footer';
import BookList from '../component/booklist';
import Hero from '../component/hero';
import BookCategories from '../component/bookcategories';
import FeaturedBooks from '../component/featuredbooks';

export default function Library() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const bookListRef = useRef();

  const handleSearch = () => {
    setSelectedCategory('all'); // Reset category on search
    setTimeout(() => {
      bookListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Wait briefly to ensure BookList is rendered
  };

  return (
    <div>
      <Navbar />
      <Hero 
        onSearchButtonClick={handleSearch}
        keyword={searchKeyword}
        setKeyword={setSearchKeyword}
      />
      <FeaturedBooks />
      <BookCategories onCategorySelect={setSelectedCategory} />
   <BookList
  selectedCategoryId={selectedCategory}
  searchKeyword={searchKeyword}
  setSearchKeyword={setSearchKeyword}  // Pass state setter
  onSearch={handleSearch}              // Scroll on typing
  ref={bookListRef}
/>
      <Footer />
    </div>
  );
}
