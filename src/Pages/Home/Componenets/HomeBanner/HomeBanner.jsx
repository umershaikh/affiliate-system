import React from 'react';
import './HomeBanner.css';

const HomeBanner = () => {
  return (
    <section 
      className="banner-section bg-img" 
      style={{
        backgroundImage: `url('https://script.viserlab.com/revptc/assets/images/frontend/banner/6381de5b2c50b1669455451.png')`
      }}
    >
      {/* Wave Block */}
      <div 
        className="wave-block bg-img"
        style={{
          backgroundImage: `url('https://script.viserlab.com/revptc/assets/templates/basic/images/banner/wave.png')`
        }}
      ></div>

      {/* Main Content */}
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-8 text-center">
            <div className="banner-content">
              <h1 className="title text-white">
                Enlarge Your Network And Get More Commissions
              </h1>
              <p className="text-white">
                Win more commissions by making more members and increase your capital. 
                And you can earn more money by viewing advertisements on our site.
              </p>
              <div className="banner-btn">
                <a href="user/register" className="btn-base">
                  Let's Start
                </a>
                <a href="#plan" className="btn-base active">
                  Choose Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Particles Container */}
      <div id="particles">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeBanner;