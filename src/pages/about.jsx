import { Info } from 'lucide-react'
import React from 'react'
import InfoPart from '../component/info'
import Navbar from '../component/navbar'
import Footer from '../component/footer'

export default function About() {
  return (
    <div>
        <Navbar/>
      <InfoPart/>
      <Footer/>
    </div>
  )
}
