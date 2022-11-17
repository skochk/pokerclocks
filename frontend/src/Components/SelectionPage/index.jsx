import React, {useState, useEffect, useRef} from 'react';
import styles from './styles.module.scss';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

let tempEndpoint = "http://localhost:8080/gameApi";
function SelectionComponent() {
    const [gameCode,setGameCode] = useState("");
    const [alertMessage,setAlertMessage] = useState("");
    let codeRef = useRef("")
    const navigate = useNavigate();

    useEffect(() => {
        const listener = event => {
          if (event.code === "Enter" || event.code === "NumpadEnter") {
            console.log("Enter key was pressed. Run your function.");
            event.preventDefault();
            loadGame();
          }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
    }, []);

    async function loadGame(){
        console.log("load:",codeRef.current);
        axios.post(tempEndpoint+"/load",{code: codeRef.current},{
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(data=>{
            console.log(data.data);
            if(!data.data.errorMessage){
                console.log('get in ')
                navigate("/game/" + data.data.code);
            }else{
                setAlertMessage("Game not found, create new one!");
            }
        })
    }

    function HandleGameInput(value){
        console.log(value.toUpperCase());
        setGameCode(value.toUpperCase());
        codeRef.current = value.toUpperCase();
    }
  return (
    <div className={styles.content}>
        <div className={styles.container}>
            <div className={styles.chooseMenu}>
                <div className={styles.card}>
                    <p>open game by code</p>
                    <input value={gameCode} onChange={e=>HandleGameInput(e.target.value)}/>
                    <button onClick={e=>loadGame()}>open</button>
                    <div className={styles.alertMessage}>{alertMessage}</div>
                </div>
                <div className={styles.card}>
                    <p>Create</p>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default SelectionComponent