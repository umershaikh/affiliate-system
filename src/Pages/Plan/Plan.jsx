import React from 'react'
import HomePricing from '../Home/Componenets/HomePricing/HomePricing'
import PlanBanner from './PlanBanner';


function Plan() {
  return (
    <div style={{ position: 'relative', bottom: '150px' }}>
    <PlanBanner/>
    <HomePricing/>
  
    </div>
  )
}

export default Plan;