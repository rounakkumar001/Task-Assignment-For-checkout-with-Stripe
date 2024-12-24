import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/checkout/paymentCanceled.module.css';

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.content}`}>
        <h2 className={`${styles.title}`}>Payment Canceled</h2>
        
        <div className={`${styles.iconContainer}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className={`${styles.cancelIcon}`}
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <p className={`${styles.message}`}>
          Your payment has been canceled. 
          No charges have been made to your account.
        </p>

        <div className={`${styles.actionButtons}`}>
          <button 
            className={`${styles.homeButton}`} 
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
          
          <button 
            className={`${styles.cartButton}`} 
            onClick={() => navigate('/cart-items')}
          >
            Back to Cart
          </button>
        </div>

        <div className={`${styles.helpSection}`}>
          <h3>Need Help?</h3>
          <p>If you experienced any issues during checkout, please contact our support team.</p>
          <a href="/contact" className={`${styles.contactLink}`}>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default PaymentCanceled;
