import logo from './logo.svg';
import './App.css';
import socketIOClient from "socket.io-client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import GamePage from './Components/GamePage';
import HeaderBar from './Components/Header';

const ENDPOINT = "http://localhost:8080";

function App() {

  // const [response, setResponse] = useState("");
  // const [data, setData] = useState({ hits: [] });

  // useEffect(() => {
  //   const socket = socketIOClient(ENDPOINT);
  //   socket.on("FromAPI", data => {
  //     setResponse(data);
  //     console.log(data)
  //   });
  // }, []);

  return (
    <div className="App">
      <HeaderBar/>
      <GamePage/>
    </div>
  );
}

export default App;
