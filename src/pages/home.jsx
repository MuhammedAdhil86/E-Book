import React from 'react'
import NewRelease from '../component/landingpage'

import AboutSection from '../component/about'
import Navbar from '../component/navbar'
import PodcastSection from '../component/poadcast'
import TestimonialCarousel from '../component/testimonialCarousel'
import NewsletterSubscribe from '../component/newslatter'
import Footer from '../component/footer'
import FeaturedBooks from '../component/featuredbooks'
export default function Home() {
  return (
    <>
    <div>
        <Navbar/>
<NewRelease/>
<FeaturedBooks/>

<AboutSection/>
<PodcastSection/>
<TestimonialCarousel/>
<NewsletterSubscribe/>
<Footer/>
    </div>
    </>
  )
}
