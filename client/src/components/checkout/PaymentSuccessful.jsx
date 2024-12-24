import React from 'react';
// import styles from '../../styles/paymentSuccessful.module.css'; // Adjust the path as necessary
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/checkout/paymentSuccessful.module.css'
const PaymentSuccessful = () => {


  const location = useLocation();
  const { transactionId, amount, email } = location.state || {};

  // const transection = localStorage.getItem("TransectionId");
  // console.log("transection", transection);

  const navigate = useNavigate();
  return (
    <div className={`${styles.container}`}>
      <h2 className={`${styles.title}`}>Payment Successful!</h2>
      <p className={`${styles.message}`}>
        Thank you for your payment! Your transaction has been completed successfully.
      </p>
      <div className={`${styles.details}`}>
        {/* <p><strong>Transaction ID:</strong> {transactionId}</p> */}
        {/* <p><strong>Amount Charged:</strong> ${(amount / 100).toFixed(2)}</p> */}
        {/* <p><strong>Amount Charged:</strong> ₹{amount}</p> */}
        {/* <p><strong>Email:</strong> {email}</p> */}
      </div>
      <button className={`${styles.button}`} onClick={() => navigate('/')}>
        Return to Home
      </button>
    </div>
  );
}

export default PaymentSuccessful;
