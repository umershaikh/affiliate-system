import React from 'react'
import InnerBanner from './Components/InnerBanner/InnerBanner'
import HomeHero from '../Home/Componenets/HomeHero/HomeHero';
import RevCounter from '../Home/Componenets/RevCounter/RevCounter';
import TestimonialSection from '../Home/Componenets/TestimonialSection/TestimonialSection';
import ExpertTeam from '../Home/Componenets/ExpertTeam/ExpertTeam';


function About() {
  return (
    <div style={{ position: 'relative', bottom: '150px' }}>
      <InnerBanner/>
      <HomeHero/>
      <RevCounter/>
      <TestimonialSection/>
      <ExpertTeam/>
    </div>
  )
}

export default About;