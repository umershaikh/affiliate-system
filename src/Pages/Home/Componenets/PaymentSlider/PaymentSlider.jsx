import React from 'react';

// Import local images
import Jazzcash from '../../../../Images/Jazzcash.png';
import Easypaisa from '../../../../Images/Easypaisa.jpg';
import Sadapay from '../../../../Images/Sadapay.png';
import Nayapay from '../../../../Images/Nayapay.png';
import BankTransfer from '../../../../Images/BankTransfer.png';

import './PaymentSlider.css';

const PaymentSlider = () => {
    const paymentMethods = [
        { name: "JazzCash", src: Jazzcash },
        { name: "EasyPaisa", src: Easypaisa },
        { name: "SadaPay", src: Sadapay },
        { name: "NayaPay", src: Nayapay },
        { name: "Bank Account", src: BankTransfer },
    ];

    return (
        <section className="vslBrandSection">
            <div className="vslContainer">
                <div className="vslRow">
                    <div className="vslColCenter">
                        <div className="vslSectionHeader">
                            <h3 className="vslSubTitle">PAYMENT METHODS</h3>
                            <h2 className="vslSectionTitle">Our Local Payment Options</h2>

                        </div>
                    </div>
                </div>

                <div className="vslRow">
                    <div className="vslColFull">
                        <div className="vslBrandWrapper">
                            {paymentMethods.map((method, index) => (
                                <div className="vslBrandItem" key={index}>
                                    <img 
                                        src={method.src} 
                                        alt={method.name} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentSlider;