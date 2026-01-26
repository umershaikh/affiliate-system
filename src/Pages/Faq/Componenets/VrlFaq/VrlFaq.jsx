import React, { useState } from 'react';
import './VrlFaq.css';

const VrlFaq = () => {
    // Initializing with IDs 1 and 4 open to match the UI screenshot
    const [openIds, setOpenIds] = useState([]);

    const toggleFaq = (id) => {
        setOpenIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const faqData = [
        { id: 1, q: "How to making a withdrawal?", a: "You can make a withdrawal from the Withdraw page. Where possible we are required to send funds back to the payment method that was used to deposit the original funds." },
        { id: 4, q: "How Does the Binary MLM Plan Works?", a: "Binary MLM plan is a network marketing compensation strategy used by many top-performing MLM companies. The new members sponsored by distributors are added either on the left or right leg." },
        { id: 2, q: "I have not received my withdrawal", a: "The processing time for your withdrawal will vary depending on your payment method. Please check the Payments page for clearance times." },
        { id: 5, q: "What is a Binary MLM Plan?", a: "The binary MLM plan is defined as a compensation plan that consists of two legs (left & right) or subtrees under every distributor." },
        { id: 3, q: "Advantages/Benefits of Binary MLM Plan", a: "Unlimited depth, group work via spillover, quick growth opportunities, and carry-forward sales volume." },
        { id: 6, q: "How to Deposit Money?", a: "You can make a deposit from the deposit page. Choose any payment method and pay the amount to deposit into your balance." }
    ];

    return (
        <section className="vrl-faq-section">
            <div className="vrl-faq-container">
                <div className="vrl-faq-header">
                    <span className="vrl-faq-sub">
                        We always care for our clients, we have tried to answer some frequent questions about your business
                    </span>
                    <h2 className="vrl-faq-main">A Frequently Asked Questions</h2>
                    <div className="vrl-faq-divider"></div>
                </div>

                <div className="vrl-faq-grid">
                    {faqData.map((item) => (
                        <div 
                            key={item.id} 
                            className={`vrl-faq-item ${openIds.includes(item.id) ? 'is-open' : ''}`}
                        >
                            <button className="vrl-faq-trigger" onClick={() => toggleFaq(item.id)}>
                                <h6 className="vrl-faq-title">{item.q}</h6>
                                <span className="vrl-faq-icon">
                                    {openIds.includes(item.id) ? '−' : '+'}
                                </span>
                            </button>
                            <div className="vrl-faq-body">
                                <div className="vrl-faq-content">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VrlFaq;