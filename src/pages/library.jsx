import React from 'react'
import Navbar from "../component/navbar";
import ProductList from '../component/productlist'
import Footer from '../component/footer'

export default function Library() {
  return (
    <div>
      <Navbar/>
      <ProductList/>
      <Footer/>
    </div>
  )
}
