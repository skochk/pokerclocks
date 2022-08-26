import React, { useState, useEffect } from "react";
import styles from './styles.module.scss'
import io from 'socket.io-client';
import MainTimer from './mainTimer';
import axios from "axios"


const ENDPOINT = "http://localhost:8080";
const socket = io(ENDPOINT);

function GameComponent() {
  const [isSocketConn, setIsSocketConn] = useState(false);
  const [lastPong, setLastPong] = useState(null);
  const [game,setGame] = useState({});
  const [currentTime, setCurrrentTime] = useState(new Date().getHours() + ':' + new Date().getMinutes());


  useEffect(()=>{
    setInterval(() => { 
      setCurrrentTime(new Date().getHours() + ':' + new Date().getMinutes()); 
    }, 60000)

  },[currentTime])  

  let tempCode = 'JEIYG';

  function handleGameChange(newValues){
    setGame(newValues);
    // socket.emit('room-msg',newValues);
  } 
  
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
    socket.on('room-msg', function(msg){
      let parsed = JSON.parse(msg);
      console.log(parsed.status,parsed);
      if(parsed.status == "msg"){
        handleGameChange(parsed.payload);
      }else if(parsed.status == "sync"){
        console.log('sending back data for sync', game)
        socket.emit('room-msg',{status:'msg',payload:game})
      }else{
        
        console.log('error fetching data from socket')
      }
      // setGameTime(parsed.currentTime);
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
          <MainTimer game={game} updateParent={handleGameChange}/>
        </div>

        <div className={styles.element}></div>
    </div>
  )
}

export default GameComponent;