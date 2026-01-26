import React from 'react'
import ContactBanner from './ContactBanner'
import ContactSection from './ContactSection'

function Contact() {
  return (
    <div style={{ position: 'relative', bottom: '150px' }}>
      <ContactBanner/>
      <ContactSection/>
    </div>
  )
}

export default Contact