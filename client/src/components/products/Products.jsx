import React, { useEffect } from 'react'
import styles from '../../styles/products/products.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { featchProducts } from '../../features/productSlice.js';
import { addToCart } from '../../features/cartSlice.js';
import { useNavigate } from 'react-router-dom';
const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products)
  console.log(products);

  useEffect(() => {
    dispatch(featchProducts());
  }, [dispatch])


  const handleAddToCart = (product) => {
    dispatch(addToCart(product)); 
    // navigate('/cart-items');
  };

  return (
    <main className={`${styles.container}`}>
      {/* <h1 className={`${styles.pageTag}`}>Products</h1> */}
      <div className={`${styles.subContainer}`}>
        <div className={`${styles.header}`}>

        </div>
        {
          products ?
            products.map((item, index) => (
              <div className={`${styles.product}`} key={index}>
                {/* product list  */}
                <img width={60} src={item.url} alt="" />
                <p className={`${styles.prodName}`}>{item.title.longTitle}</p>
                <p className={`${styles.prodPriceDescOff}`}>
                  <span className={`${styles.price}`}>₹{item.price.cost}</span>
                  <del className={`${styles.discount}`}>₹{item.price.mrp}</del>
                  <span className={`${styles.off}`}>{item.price.discount} off</span>
                </p>
                <p className={`${styles.prodDelivery}`}>Free delivery</p>
                <p className={`${styles.prodSaver}`}>{item.tagline}</p>
                <div>
                  <p className={`${styles.prodDescTitle}`}>Description : </p>
                  <p className={`${styles.prodDescPara}`}>{item.description}</p>
                </div>
                <div className={`${styles.buttonGroup}`}>
                  <button className={`${styles.button} ${styles.addToCartBtn}`}  onClick={() => handleAddToCart(item)}>ADD TO CART</button>
                  <button className={`${styles.button}  ${styles.buyNowBtn}`}>BUY NOW</button>
                </div>
              </div>
            ))


            :
            <h1>Loading...</h1>
        }
      </div>
    </main>
  )
}

export default Products