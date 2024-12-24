import React from 'react';
import styles from '../../styles/cart/cart.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart } from '../../features/cartSlice.js'; // Import removeFromCart action

const Carts = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart); // Get cart items from Redux store

    const handleRemoveFromCart = (item) => {
        dispatch(removeFromCart(item)); // Dispatch action to remove item
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.price.cost * item.quantity), 0);
    };

    return (
        <div>
            <div className={`${styles.cartItems}`}>
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className={`${styles.cartItem}`}>
                            <p className={`${styles.prodName}`}>{item.title.longTitle}</p>
                            <p className={`${styles.prodPriceDescOff}`}>
                                <span className={`${styles.price}`}>₹{item.price.cost}</span>
                                <del className={`${styles.discount}`}>₹{item.price.mrp}</del>
                                <span className={`${styles.off}`}>{item.price.discount} off</span>
                            </p>
                            <p className={`${styles.prodDelivery}`}>Free delivery</p>
                            <div className={`${styles.buttonGroup}`}>
                                <button 
                                    className={`${styles.button} ${styles.remove}`} 
                                    onClick={() => handleRemoveFromCart(item)} // Attach click handler
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>

            {items.length > 0 && (
                <div className={`${styles.cartFooter}`}>
                    <p className={`${styles.grandTotal}`}>Total: ₹{calculateTotal()}</p>
                    <button 
                        onClick={() => navigate('/cart-items/checkout')} 
                        className={`${styles.checkoutBtn}`}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Carts;
