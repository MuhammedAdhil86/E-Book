import React from 'react'
import NewRelease from '../component/landingpage'
import BooksSection from '../component/bookssection'
import AboutSection from '../component/about'
import Navbar from '../component/navbar'
import PodcastSection from '../component/poadcast'
import TestimonialCarousel from '../component/testimonialCarousel'
import NewsletterSubscribe from '../component/newslatter'
import Footer from './footer'
export default function Home() {
  return (
    <>
    <div>
        <Navbar/>
<NewRelease/>
 <BooksSection/>

<AboutSection/>
<PodcastSection/>
<TestimonialCarousel/>
<NewsletterSubscribe/>
<Footer/>
    </div>
    </>
  )
}
