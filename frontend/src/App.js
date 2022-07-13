import logo from './logo.svg';
import './App.css';
import socketIOClient from "socket.io-client";
import React, { useState, useEffect } from "react";
import axios from 'axios';

const ENDPOINT = "http://localhost:8080";

function App() {

  const [response, setResponse] = useState("");
  const [data, setData] = useState({ hits: [] });

  useEffect(async () => {
    const result = await axios(
      'http://localhost:8080',
    );
    console.log(result)
    setData(result.data);
  });

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
      console.log(data)
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
