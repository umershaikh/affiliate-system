import React from 'react';
import './BlogBanner.css';

const BlogBanner = ({ title = "Blog", breadcrumbActive = "Blog" }) => {
  return (
    <section className="blog-banner-container">
      <div className="blog-overlay-content">
        <div className="blog-wrapper">
          <h1 className="blog-main-title">{title}</h1>
          <nav aria-label="breadcrumb" className="blog-breadcrumb-nav">
            <ul className="blog-breadcrumb-list">
              <li className="blog-breadcrumb-item">
                <a href="/" className="blog-link">Home</a>
              </li>
              <li className="blog-breadcrumb-separator">/</li>
              <li className="blog-breadcrumb-item blog-active" aria-current="page">
                {breadcrumbActive}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default BlogBanner;