import React from 'react'
import HomeBanner from './Componenets/HomeBanner/HomeBanner'
import HomeHero from './Componenets/HomeHero/HomeHero'
import HomeServices from './Componenets/HomeServices/HomeServices'
import HomeWorkProcess from './Componenets/HomeWorkProcess/HomeWorkProcess'
import HomePricing from './Componenets/HomePricing/HomePricing'
import ExpertTeam from './Componenets/ExpertTeam/ExpertTeam.jsx'
import RevCounter from './Componenets/RevCounter/RevCounter.jsx'
import LatestBlogs from './Componenets/LatestBlogs/LatestBlogs.jsx'
import TransactionTable from './Componenets/TransactionTable/TransactionTable.jsx'
import Newsletter from './Componenets/Newsletter/Newsletter.jsx'
import PaymentSlider from './Componenets/PaymentSlider/PaymentSlider.jsx'
import VideoSection from './Componenets/VideoSection/VideoSection.jsx'
import TestimonialSection from './Componenets/TestimonialSection/TestimonialSection.jsx'



function Home() {
  return (
    <div>
        <HomeBanner/>
        <HomeHero/>
        <HomeServices/>
        <VideoSection/>
        <HomeWorkProcess/>
        <HomePricing/>
        <ExpertTeam/>
        <RevCounter/>
        <TestimonialSection/>
        <LatestBlogs/>
        <TransactionTable/>
        <Newsletter/>
        <PaymentSlider/>

      
    </div>
  )
}

export default Home