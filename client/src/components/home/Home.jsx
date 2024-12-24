import React from 'react';
import styles from '../../styles/home/home.module.css';
import Wrapper from '../global/Wrapper';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  return (
    <>
      <nav className={`${styles.navContainer}`}>
        <div className={`${styles.navFirstChild}`}>
          <p onClick={() => navigate('/')} className={`${styles.navLogo}`}>.Ecom<sup>©</sup></p>
          <ul type='none' className={`${styles.navLinkContainer}`}>
            <NavLink to={'/'} className={`${styles.NavLink}`}>
              {({ isActive }) => (
                <span className={isActive ? styles.activeLink : styles.navLink}>Home</span>
              )}
            </NavLink>

            <NavLink to={'/cart-items'} className={`${styles.NavLink}`}>
              {({ isActive }) => (
                <span className={isActive ? styles.activeLink : styles.navLink}>
                  Cart Items {items.length > 0 && `(${items.length})`}
                </span>
              )}
            </NavLink>
          </ul>
        </div>
      </nav>

      {/* Product List */}
      <Wrapper>
        <Outlet />
        {/* <Products/> */}
      </Wrapper>
    </>
  );
};

export default Home;
