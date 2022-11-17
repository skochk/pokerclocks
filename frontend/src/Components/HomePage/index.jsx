import React from 'react';
import { Link } from "react-router-dom";

function HomeComponent() {
  return (
    <div>
        <h1>Simple poker clocks for home games!</h1>
        <Link to="/selection">Start</Link>
    </div>
  )
}

export default HomeComponent;