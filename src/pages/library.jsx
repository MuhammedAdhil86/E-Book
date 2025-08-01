// File: src/pages/Library.jsx
import React, { useState } from 'react';
import Navbar from "../component/navbar";
import Footer from '../component/footer';
import BookList from '../component/booklist';
import Hero from '../component/hero';
import BookCategories from '../component/bookcategories';
import FeaturedBooks from '../component/featuredbooks';

export default function Library() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedBooks />
      <BookCategories onCategorySelect={setSelectedCategory} />
      <BookList selectedCategoryId={selectedCategory} />
      <Footer />
    </div>
  );
}
