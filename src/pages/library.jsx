import React from 'react'
import Navbar from "../component/navbar";
import Footer from '../component/footer'
import BookList from '../component/booklist';

export default function Library() {
  return (
    <div>
      <Navbar/>
      <BookList/>
      <Footer/>
    </div>
  )
}
