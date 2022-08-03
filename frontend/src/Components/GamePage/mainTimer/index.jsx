import React, { useState, useEffect } from "react";

function MainClocks(props) {
    const currentTime = props.currentTime;
    return (
        <div style={{height: "100px", width: "100px"}}>props:{currentTime}</div>
    )
}

export default MainClocks;