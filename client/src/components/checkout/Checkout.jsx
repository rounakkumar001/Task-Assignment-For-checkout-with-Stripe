import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import styles from '../../styles/checkout/checkout.module.css';
import api from '../../axios/axios.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Checkout = () => {
  const [email, setEmail] = useState(''); // State to hold email input
  const { items } = useSelector((state) => state.cart);
  const [loading, setloading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value); // Update state with input value
  };

  const navigate = useNavigate();

  // const handleNext = async () => {
  //   if (!email) {
  //     alert("Please enter your email address.");
  //     return;
  //   }

  //   const calculateTotal = () => {
  //     return items.reduce((total, item) => total + (item.price.cost * item.quantity), 0);
  //   };

  //   const amount = calculateTotal();
  // };

  // const makePayment = async() => {
  //   const stripe = await loadStripe('pk_test_51QZ7u9JjjtKRr0sEOvdSBi0mmya0cMYCngETUo59JXYtrUk9uU6fsr0nYB7d9Fovo7Xho0MNjK1cCVsQQDULVrHt00EPqZTW93');

  //   const body = {
  //     products : items
  //   }

  //   const headers = {
  //     "Content-Type" : "application/json"
  //   }

  //   // const response =  await fetch("http://locahost/8080/api/v1/create-checkout-session", {
  //   //   method : "POST",
  //   //   headers : headers,
  //   //   body : JSON.stringify(body)  
  //   // })

  //   const response = await api.post("http://localhost/8080/api/v1/create-checkout-session", {products : items});

  //   console.log(response);
  //   const session = await response.json();

  //   const result = stripe.redirectToCheckout({
  //     sessionId : session.id
  //   })


  //   if(result.error){
  //     console.log(result.error)
  //   }

  //   console.log(items);
  // }


  const makePayment = async () => {
    try {

      if(!email){
        alert("Plese enter your email address.")
        return;
      }

      setloading(true);
      const stripe = await loadStripe('pk_test_51QZ7u9JjjtKRr0sEOvdSBi0mmya0cMYCngETUo59JXYtrUk9uU6fsr0nYB7d9Fovo7Xho0MNjK1cCVsQQDULVrHt00EPqZTW93');

      const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.price.cost * item.quantity), 0);
      };
      const totalAmount = calculateTotal();

      const response = await api.post("/api/v1/create-checkout-session", {
        products: items,
        totalAmount : totalAmount,
        email : email

      });

      const session = response.data; // Use response.data for Axios

      console.log("session : ", session);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      // const transection = localStorage.setItem("TransectionId", session.id);
      // console.log("transection", transection);
      
      if (result.error) {
        console.error("Stripe Checkout Error:", result.error);
      }

      setloading(false);
      

    } catch (error) {
      console.error("Payment Error:", error);

      if (error.response) {

        console.log(error.response.data);
        console.log(error.response.status);
      } else if (error.request) {

        console.log(error.request);
      } else {

        console.log('Error', error.message);
      }

      setloading(false);
    }

  };


  return (
    <div className={`${styles.container}`}>
      <p className={`${styles.title}`}>Please provide required details</p>
      <hr />

      <div className={`${styles.formBox}`}>
        <div className={`${styles.inputBox}`}>
          <label className={`${styles.label}`} htmlFor="email">Email address*</label>
          <br />
          <input
            className={`${styles.inputField}`}
            type="email"
            placeholder='Enter your email address'
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>



        <button
          className={`${styles.nextBtn}`}
          onClick={() => makePayment()}
          disabled={loading}
        >
          {loading ? "Processing.." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
