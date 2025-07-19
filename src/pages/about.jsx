import { Info } from 'lucide-react'
import React from 'react'
import InfoPart from '../component/info'
import Alt_Navbar from '../component/alternative/alternative-nav'
import Footer from '../component/alternative/footer'

export default function About() {
  return (
    <div>
        <Alt_Navbar/>
      <InfoPart/>
      <Footer/>
    </div>
  )
}
