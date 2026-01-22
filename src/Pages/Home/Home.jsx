import React from 'react'
import Header from './Componenets/Header/Header'
import HomeBanner from './Componenets/HomeBanner/HomeBanner'
import HomeHero from './Componenets/HomeHero/HomeHero'

function Home() {
  return (
    <div>
        <Header/>
        <HomeBanner/>
        <HomeHero/>
    </div>
  )
}

export default Home