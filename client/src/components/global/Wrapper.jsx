import React from 'react';
import styles from '../../styles/global/global.module.css';

const Wrapper = ({ children }) => {
    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.subContainer}`}> {children}</div>
        </div>
    )
}

export default Wrapper