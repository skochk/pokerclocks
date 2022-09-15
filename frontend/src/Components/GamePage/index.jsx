import React, { useState, useEffect ,useRef} from "react";
import styles from './styles.module.scss'
import io from 'socket.io-client';
import MainTimer from './mainTimer';
import axios from "axios";


const ENDPOINT = "http://localhost:8080";
// const socket = io(ENDPOINT);

function GameComponent() {
  const [isSocketConn, setIsSocketConn] = useState(false);
  const [lastPong, setLastPong] = useState(null);
  const [game,setGame] = useState({});
  const [currentTime, setCurrrentTime] = useState(new Date().getHours() + ':' + new Date().getMinutes());
  const socketRef = useRef(null);
  const gameRef = useRef({});


  useEffect(()=>{
    setInterval(() => { 
      setCurrrentTime(new Date().getHours() + ':' + new Date().getMinutes()); 
    }, 60000)

  },[currentTime])  

  let tempCode = 'JEIYG';

  function handleGameChange(newValues){
    setGame(newValues);
    gameRef.current = newValues;
    // socketRef.current.emit('room-msg',newValues);
  } 
  const emitGameChanges = (values)=>{
    socketRef.current.emit('room-msg',{status:'msg',payload:values});
  }
  
  useEffect(()=>{
    socketRef.current = io(ENDPOINT);
    socketRef.current.on('connect', () => {
      console.log('connected to socket');
      setIsSocketConn(true);
    });
    socketRef.current.emit('joinroom',tempCode,socketRef.current.id);

    socketRef.current.on('disconnect', () => {
        setIsSocketConn(false);
    });

    socketRef.current.on('room-msg', function(msg){
      let parsed = JSON.parse(msg);
      console.log(parsed.status,parsed);
      if(parsed.status == "msg"){
        handleGameChange(parsed.payload);
      }else if(parsed.status == "sync" && Object.keys(gameRef.current).length){
        console.log('sending back data for sync', gameRef.current)
        socketRef.current.emit('room-msg',{status:'msg',payload:gameRef.current})
      }else{
        console.log('error fetching data from socket');
      }
    });
    // const emitInterval = setInterval(() => {
    //   emitGameChanges(gameRef.current);
    // }, 10000);

    return () => {
      // clearInterval(emitInterval);
      socketRef.current.off('connect');
      socketRef.current.off('disconnect');
      socketRef.current.off('pong');
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
          
          <MainTimer game={game} updateState={handleGameChange} emitState={emitGameChanges}/>
        </div>

        <div className={styles.element}></div>
    </div>
  )
}

export default GameComponent;