import React from 'react'
import LatestBlogs from '../Home/Componenets/LatestBlogs/LatestBlogs'
import BlogBanner from './BlogBanner'
import VrlFaq from '../Faq/Componenets/VrlFaq/VrlFaq'

function Blog() {
  return (
    <div style={{ position: 'relative', bottom: '150px' }}>
    <BlogBanner/>
      <LatestBlogs/>
      <VrlFaq/>
    </div>
  )
}

export default Blog