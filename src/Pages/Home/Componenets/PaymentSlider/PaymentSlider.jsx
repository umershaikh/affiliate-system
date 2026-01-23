import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import styles from './PaymentSlider.module.css';

const PaymentSlider = () => {
    const paymentMethods = [
        { name: "Paypal", src: "https://script.viserlab.com/revptc/assets/images/frontend/payment/63f9daaad40a11677318826.jpg" },
        { name: "Stripe", src: "https://script.viserlab.com/revptc/assets/images/frontend/payment/63f9d9d3e4cbb1677318611.jpg" },
        { name: "Authorize", src: "https://script.viserlab.com/revptc/assets/images/frontend/payment/63f9d9e6ac6331677318630.png" },
        { name: "Paystack", src: "https://script.viserlab.com/revptc/assets/images/frontend/payment/63f9d9f89d9901677318648.jpg" },
        { name: "Western Union", src: "https://script.viserlab.com/revptc/assets/images/frontend/payment/63f9db2b3949d1677318955.png" },
        { name: "Flutter Wave", src: "https://script.viserlab.com/revptc/assets/images/frontend/payment/63f9da927d0481677318802.png" },
    ];

    return (
        <section className={styles.vslBrandSection}>
            <div className={styles.vslContainer}>
                <div className={styles.vslRow}>
                    <div className={styles.vslColCenter}>
                        <div className={styles.vslSectionHeader}>
                            <h3 className={styles.vslSubTitle}>PAYMENT METHODS</h3>
                            <h2 className={styles.vslSectionTitle}>Our Payment System For You</h2>
                            <div className={styles.vslTitleBorder}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.vslRow}>
                    <div className={styles.vslColFull}>
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={30}
                            slidesPerView={2}
                            loop={true}
                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                            breakpoints={{
                                640: { slidesPerView: 3 },
                                768: { slidesPerView: 4 },
                                1024: { slidesPerView: 6 },
                            }}
                            className={styles.vslBrandSlider}
                        >
                            {paymentMethods.map((method, index) => (
                                <SwiperSlide key={index}>
                                    <div className={styles.vslBrandItem}>
                                        <img src={method.src} alt={method.name} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentSlider;