import React from 'react'
import NewRelease from '../component/landingpage'
import BooksSection from '../component/alternative/home-books'
import AboutSection from '../component/alternative/about'
import Alt_Navbar from '../component/alternative/alternative-nav'
import PodcastSection from '../component/alternative/poadcast'
import TestimonialCarousel from '../component/alternative/testimonialCarousel'
import NewsletterSubscribe from '../component/alternative/newslatter'
import Footer from '../component/alternative/footer'
export default function Alternavive() {
  return (
    <>
    <div>
        <Alt_Navbar/>
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
