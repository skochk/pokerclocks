import React, { useState, useEffect ,useRef} from "react";
import styles from './styles.module.scss'
import io from 'socket.io-client';
import MainTimer from './mainTimer';
import Blinds from './BlindsPage';
import BigBlinds from './BigBlinds';
import ErrorPage from './ErrorPage';
import axios from "axios";
import { useParams } from "react-router-dom";

const ENDPOINT = "http://localhost:8080";
let tempApiEndpoint = "http://localhost:8080/gameApi";

function GameComponent() {
  const [game,setGame] = useState({});
  const [currentTime, setCurrrentTime] = useState(new Date().getHours() + ':' + new Date().getMinutes());
  const socketRef = useRef(null);
  const gameRef = useRef({});
  const [totalTimePlayed, setTotalTimePlayed] = useState("0:00");
  const [isConnectedToRoom, setConnectedToRoom] = useState(false);


  useEffect(()=>{
    setInterval(() => { 
      setCurrrentTime(new Date().getHours() + ':' + new Date().getMinutes()); 
    }, 60000)

  },[currentTime]);

  let toHHMMSS = (secs) => {
    let hours  = Math.floor(secs / 3600) ? Math.floor(secs / 3600) + ":" : "";
    let minutes =  Math.floor(secs / 60) && secs > 3599 % 60 ? Math.floor(secs / 60) % 60 == 0 ? "00" : secs /60 % 60 < 10 && secs > 3599 ? "0"+Math.floor(secs /60) % 60+":" : Math.floor(secs / 60) % 60+":" : "";
    
    let seconds;
    if(secs > 59){
      seconds = secs % 60;
      if(secs % 60 == 0){
        seconds = "00";
      }
      if(secs % 60 < 10){
        seconds = "0"+ secs % 60;
      }
    }else if(secs % 60 < 10){
      seconds = "0:0" + secs % 60;
    }
    else{
      seconds = "0:" + secs % 60;
    }
    return hours+minutes+seconds;
  }

  useEffect(()=>{
    //might be writed better while only once calculated total time and then just add +1 sec to timer but I wrote Timeouts in different components:()
    if(game.levelStructure){
      let totalSecs = 0;
      for(let i = 0; i<game.currentLevel-1;i++){
        totalSecs += game.levelStructure[i].time*60;
      }
      totalSecs = totalSecs + game.levelStructure[game.currentLevel-1].time*60 - game.currentTime;
      setTotalTimePlayed(toHHMMSS(totalSecs));
    }
  },[game]);

  function handleGameChange(newValues){
    setGame(newValues);
    gameRef.current = newValues;
    // socketRef.current.emit('room-msg',newValues);
  } 
  const emitGameChanges = (values)=>{
    delete values._id;
    socketRef.current.emit('room-msg',{status:'msg',payload:values});
  }
  
  let {gameCode} = useParams(); 
  useEffect(()=>{
    socketRef.current = io(ENDPOINT);
    socketRef.current.on('connect', () => {
      console.log('connected to socket');
      // setIsSocketConn(true);
    });
    console.log('ss',gameCode.toUpperCase());
    axios.post(tempApiEndpoint+"/load",{code:gameCode},{
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(data=>{
        console.log("axios:",data.data);
        if(!data.data.errorMessage){
            console.log('connecting')
            socketRef.current.emit('joinroom',gameCode.toUpperCase(),socketRef.current.id)
            setConnectedToRoom(true);
        }else{
          setConnectedToRoom(false);
          console.log('room not found')
        }
    })
 

    socketRef.current.on('disconnect', () => {
        // setIsSocketConn(false);
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
   

    return () => {
      // clearInterval(emitInterval);
      socketRef.current.off('connect');
      socketRef.current.off('disconnect');
      socketRef.current.off('pong');
    };
  },[]); 


  return (
    <div className={styles.content}>
    {!isConnectedToRoom ? <ErrorPage/> :
      <>
        <div className={styles.element}>
          <Blinds game={game} updateState={handleGameChange} emitState={emitGameChanges}/>
        </div>
        
        <div className={[styles.element,styles.gameState].join(' ')}>
          <div className={styles.times}>
            <div className={styles.timer}>
              <img src={process.env.PUBLIC_URL + "/images/timer.png"} alt="timer" />
              <p>{totalTimePlayed}</p> 
            </div>
            <div className={styles.clocks}>
              <img src={process.env.PUBLIC_URL + "/images/clocks.png"} alt="clocks" />
              {currentTime}
            </div>
          </div>
          
          <MainTimer game={game} updateState={handleGameChange} emitState={emitGameChanges}/>
        </div>

        <div className={styles.element}>
          <BigBlinds game={game}/>
        </div>
      </>
    }
    </div>
  )
}

export default GameComponent;