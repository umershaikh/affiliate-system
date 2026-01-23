import React from 'react'
import Header from './Componenets/Header/Header'
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
import Footer from './Componenets/Footer/Footer.jsx'
import VideoSection from './Componenets/VideoSection/VideoSection.jsx'



function Home() {
  return (
    <div>
        <Header/>
        <HomeBanner/>
        <HomeHero/>
        <HomeServices/>
        <VideoSection/>
        <HomeWorkProcess/>
        <HomePricing/>
        <ExpertTeam/>
        <RevCounter/>
        <LatestBlogs/>
        <TransactionTable/>
        <Newsletter/>
        <PaymentSlider/>
        <Footer/>
      
    </div>
  )
}

export default Home