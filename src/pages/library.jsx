import React from 'react'
import Navbar from "../component/navbar";
import Footer from '../component/footer'
import BookList from '../component/booklist';
import Hero from '../component/hero';
import { BookAudioIcon } from 'lucide-react';
import BookCategories from '../component/bookcategories';
import FeaturedBooks from '../component/featuredbooks';

export default function Library() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <BookCategories/>
      <FeaturedBooks/>
      <BookList/>
      <Footer/>
    </div>
  )
}
