import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import './TestimonialSection.css';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Kathi Angel",
      role: "Managing Director",
      text: "RevPTC has allowed me to grow my network and boost my earnings. By adding more members and engaging with ads, my commissions have risen steadily.",
      img: "https://script.viserlab.com/revptc/assets/images/frontend/testimonial/6381e94f0e9861669458255.png",
      rating: 5
    },
    {
      name: "Zyan Malik",
      role: "Programmer",
      text: "Growing my network and earnings has never been easier. This platform lets me earn commissions by inviting members and viewing ads, making every effort worthwhile.",
      img: "https://script.viserlab.com/revptc/assets/images/frontend/testimonial/67bc4f8e2347b1740394382.png",
      rating: 5
    },
    {
      name: "William Trosyon",
      role: "Hedom Jater Kocchop",
      text: "RevPTC has helped me expand my network and increase my earnings. By bringing in more members and viewing ads, I’ve seen my commissions grow significantly.",
      img: "https://script.viserlab.com/revptc/assets/images/frontend/testimonial/6381e959a14021669458265.png",
      rating: 4
    },
    {
      name: "Sarah Jenkins",
      role: "Digital Marketer",
      text: "I've tried many platforms, but the transparency here is unmatched. The ad engagement metrics are clear, and the payout process is incredibly smooth.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      name: "Marcus Thorne",
      role: "UI/UX Designer",
      text: "The user interface is intuitive and the reward system is very motivating. It’s a great way to earn passive income while exploring new products.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    }
  ];

  return (
    <section className="rev-client-wrapper">
      <div 
        className="rev-bg-pattern" 
        style={{ backgroundImage: `url('https://script.viserlab.com/revptc/assets/images/frontend/testimonial/6381e940e052f1669458240.png')` }}
      ></div>

      <div className="rev-container">
        <div className="rev-section-header">
          <span className="rev-sub-title">Our Clients</span>
          <h2 className="rev-main-title">What People Say About Us</h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          /* --- SMOOTHING SETTINGS --- */
          speed={1500} // The sliding animation now takes 1.5 seconds
          autoplay={{
            delay: 3000, // Stays on each slide for 3 seconds
            disableOnInteraction: false,
          }}
          /* ------------------------- */
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="rev-swiper-main"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="rev-testimonial-card">
                <div className="rev-card-top">
                  <div className="rev-thumb-box">
                    <img src={item.img} alt={item.name} className="rev-client-img" />
                    <div className="rev-quote-badge">
                      <span>“</span>
                    </div>
                  </div>
                  <div className="rev-stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < item.rating ? '#ffb400' : '#e0e0e0' }}>★</span>
                    ))}
                  </div>
                </div>

                <div className="rev-client-details">
                  <h3>{item.name} - <span>{item.role}</span></h3>
                  <p className="rev-testimonial-text">{item.text}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSection;