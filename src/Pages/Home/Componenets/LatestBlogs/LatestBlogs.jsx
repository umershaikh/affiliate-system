import React from 'react';
import './LatestBlogs.css';

const LatestBlogs = () => {
  const blogs = [
    {
      id: 1,
      date: "22 Nov",
      image: "https://script.viserlab.com/revptc/assets/images/frontend/blog/thumb_67bc652d056331740399917.png",
      title: "2022's Top Leading MLM Companies in the U.S. Market",
      excerpt: "Note: 2025 revenue numbers coming soon. Below is the comprehensive list of multi-...",
      link: "#"
    },
    {
      id: 2,
      date: "22 Nov",
      image: "https://script.viserlab.com/revptc/assets/images/frontend/blog/thumb_67bc6896397d41740400790.jpg",
      title: "Amway Co-Founder Richard DeVos Passes Away at Age 92",
      excerpt: "Rick DeVos announced earlier today that his grandfather and co-founder of Amway...",
      link: "#"
    },
    {
      id: 3,
      date: "22 Nov",
      image: "https://script.viserlab.com/revptc/assets/images/frontend/blog/thumb_6381ee30bcae11669459504.jpg",
      title: "Melaleuca CEO Frank VanderSloot Promises to Resign",
      excerpt: "In an interview with East Idaho News today, Melalecua CEO Frank Vandersloot prom...",
      link: "#"
    }
  ];

  return (
    <section className="unique-blog-wrapper">
      <div className="unique-blog-container">
        <div className="unique-blog-header">
          <span className="unique-sub-title">BLOGS</span>
          <h2 className="unique-main-title">Latest Blogs</h2>
          <div className="unique-title-divider"></div>
        </div>

        <div className="unique-blog-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="unique-blog-card">
              <div className="unique-thumb-box">
                <img src={blog.image} alt={blog.title} className="unique-blog-img" />
                <div className="unique-date-badge">{blog.date}</div>
              </div>
              <div className="unique-content-box">
                <h3 className="unique-card-title">
                  <a href={blog.link}>{blog.title}</a>
                </h3>
                <p className="unique-card-text">{blog.excerpt}</p>
                <a href={blog.link} className="unique-read-more">
                  Read more <span className="unique-arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;