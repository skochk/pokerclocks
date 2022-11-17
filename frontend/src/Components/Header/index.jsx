import React from 'react';
import styles from './styles.module.scss';
import { Link } from "react-router-dom";

function HeaderBar() {
  return (
    <div className={styles.header}> 
      <Link to="/">HOME</Link> 
      <Link to="/selection">GAME</Link> 
      <Link to="/about">ABOUT</Link>
    </div>
  )
}

export default HeaderBar;