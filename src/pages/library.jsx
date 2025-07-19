import React from 'react'
import Alt_Navbar from "../component/alternative/alternative-nav";
import ProductList from '../component/productlist'
import Footer from '../component/alternative/footer'

export default function Library() {
  return (
    <div>
      <Alt_Navbar/>
      <ProductList/>
      <Footer/>
    </div>
  )
}
