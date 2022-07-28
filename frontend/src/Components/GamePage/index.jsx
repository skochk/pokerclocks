import React, { useState, useEffect } from "react";
import styles from './styles.module.scss'
import io from 'socket.io-client';


const ENDPOINT = "http://localhost:8080";
const socket = io(ENDPOINT);

function GameComponent() {
    const [isSocketConn, setIsSocketConn] = useState(socket.connected);
    const [lastPong, setLastPong] = useState(null);
    const [game,setGame] = useState({});
    let tempCode = 'JEIYG';

  useEffect(() => {
    socket.on('connect', () => {
        console.log('connected to socket')
        setIsSocketConn(true);
    });
    socket.emit('joinroom',tempCode,socket.id);
  });

  useEffect(()=>{
    socket.on('disconnect', () => {
        setIsSocketConn(false);
    });

    socket.on('pong', () => {
        let current = new Date().toISOString();
        console.log(current); 
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
        <div className={styles.temp}>is socket: {isSocketConn},lastPong:{lastPong},game:{JSON.stringify(game)}</div>
        gameComponent

    </div>
  )
}

export default GameComponent;