import React from 'react'
import FaqBanner from './Componenets/FaqBanner/FaqBanner'
import RevCounter from '../Home/Componenets/RevCounter/RevCounter'
import ExpertTeam from '../Home/Componenets/ExpertTeam/ExpertTeam'

import VrlFaq from './Componenets/VrlFaq/VrlFaq'

function Faq() {
  return (
    <div style={{ position: 'relative', bottom: '150px' }}>
      <FaqBanner/>
      <VrlFaq/>
      <RevCounter/>
      <ExpertTeam/>
    </div>
  )
}

export default Faq