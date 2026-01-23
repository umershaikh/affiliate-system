import React from 'react';
import './HomeServices.css';

const HomeServices = () => {
  const services = [
    {
      title: "Profitable",
      desc: "You can get the golden opportunity to actually win a lot of profit here.",
      icon: "fas fa-money-bill-wave"
    },
    {
      title: "Secure",
      desc: "Gives ultimate security with 2FA authentication with this system",
      icon: "fas fa-lock"
    },
    {
      title: "Multilingual",
      desc: "This site can be easily translated into your own language.",
      icon: "fas fa-language"
    },
    {
      title: "Crypto",
      desc: "Cryptocurrency stored on our servers is covered by our insurance policy.",
      icon: "fas fa-coins"
    },
    {
      title: "Support",
      desc: "We always provide the best support to all our users.",
      icon: "fas fa-headset"
    },
    {
      title: "Global",
      desc: "We support a variety of the most popular digital currencies.",
      icon: "fas fa-globe-americas"
    }
  ];

  return (
    <section className="hs-section">
      <div className="hs-container">
        <div className="hs-header">
          <h3 className="hs-sub-title">OUR SERVICES</h3>
          <h2 className="hs-main-title">What We Serve To Our Members</h2>
          <div className="hs-title-border"></div>
        </div>
        
        <div className="hs-grid">
          {services.map((item, index) => (
            <div className="hs-item" key={index}>
              <div className="hs-body">
                <div className="hs-icon">
                  <i className={item.icon}></i>
                </div>
                <div className="hs-content">
                  <h3 className="hs-item-title">{item.title}</h3>
                  <p className="hs-item-desc">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServices;