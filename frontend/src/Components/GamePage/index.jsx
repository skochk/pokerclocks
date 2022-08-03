import React, { useState, useEffect } from "react";
import styles from './styles.module.scss'
import io from 'socket.io-client';
import MainTimer from './mainTimer';

// import clocksLogo from '../../../public/images/clocks.png';


const ENDPOINT = "http://localhost:8080";
const socket = io(ENDPOINT);

function GameComponent() {
    const [isSocketConn, setIsSocketConn] = useState(false);
    const [lastPong, setLastPong] = useState(null);
    const [game,setGame] = useState({});
    const [currentTime, setCurrrentTime] = useState(new Date().getHours() + ':' + new Date().getMinutes());
    const [gameTime, setGameTime] = useState(100)

    useEffect(()=>{
      const intervalID = setInterval(() => {setGameTime(gameTime-1)}, 1000);
      return () => clearInterval(intervalID); //prevent wrong cal lback from setInterval
    },[gameTime])  

    useEffect(()=>{
      setInterval(() => { 
        setCurrrentTime(new Date().getHours() + ':' + new Date().getMinutes()); 
      }, 60000)

    },[currentTime])

    let tempCode = 'JEIYG';


  useEffect(()=>{
    socket.on('connect', () => {
      console.log('connected to socket')
      setIsSocketConn(true);
    });
    socket.emit('joinroom',tempCode,socket.id);

    socket.on('disconnect', () => {
        setIsSocketConn(false);
    });

    socket.on('pong', () => {
        let current = new Date().toISOString();
        setLastPong(current);
    });
    socket.on('room-msg', function(msg,id){
      console.log(tempCode,":",msg);
      setGame(msg);
    });

    return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('pong');
    };
  },[]);  


  return (
    <div className={styles.content}>
        <div className={styles.temp}>is socket: {isSocketConn},game:{JSON.stringify(game)}</div>
        <div className={styles.element}></div>
        <div className={[styles.element,styles.gameState].join(' ')}>
          <div className={styles.times}>
            <div className={styles.timer}>
              <img src={process.env.PUBLIC_URL + "/images/timer.png"} alt="timer" />
              <p>0:55</p>
            </div>
            <div className={styles.clocks}>
              <img src={process.env.PUBLIC_URL + "/images/clocks.png"} alt="clocks" />
              {currentTime}
            </div>
          </div>
          <div className="maintime">{gameTime}</div>
        </div>
        <div className={styles.element}></div>
    </div>
  )
}

export default GameComponent;