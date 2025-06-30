import React from 'react'
import Navbar from '../component/navbar/navbar'
import ProductList from '../component/product-list/productlist'
import Footer from '../component/footer/footer'

export default function Library() {
  return (
    <div>
      <Navbar/>
      <ProductList/>
      <Footer/>
    </div>
  )
}
