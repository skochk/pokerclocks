import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import GamePage from './Components/GamePage';
import HeaderBar from './Components/Header';
import AboutPage from './Components/AboutPage';
import HomePage from './Components/HomePage';
import SelectionPage from './Components/SelectionPage';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";

const ENDPOINT = "http://localhost:8080";

function App() {

  return (
    <div className="App">
      <Router>
        <HeaderBar/>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/selection" element={<SelectionPage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/game/:gameCode" element={<GamePage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
