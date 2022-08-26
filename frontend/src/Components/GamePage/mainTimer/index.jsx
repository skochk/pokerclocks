import React, { useState, useEffect } from "react";
import styles from './styles.module.scss'



function calcTotalLeft(game){
    let totalSec = game.currentTime;
    for(let i = game.currentLevel; i<=game.levelStructure.length-1; i++){
        totalSec += game.levelStructure[i].time;    
    }

    return totalSec;
}
function calcGameLength(game){
    let gameLenth = 0;
    for(let i = 0;i<game.levelStructure.length;i++){
        gameLenth +=game.levelStructure[i].time;
    }
    return gameLenth;
}

function MainClocks(props) {
    const [progress,setProgress] = useState();
    const [totalLength, setTotalLength] = useState(null);
   
    useEffect(()=>{ 
        const intervalID = setInterval(() => {
            if(props.game.isGameGoing){
                if(props.game.currentTime < 1){
                    if(props.game.levelStructure[props.game.currentLevel]){
                        props.game.currentTime = props.game.levelStructure[props.game.currentLevel].time;
                        props.game.currentLevel += 1;
                    } 
                    else{
                        props.game.currentTime = 0;
                        clearInterval(intervalID);
                    }
                    props.updateParent(props.game);
                }else{
                    props.updateParent({...props.game,currentTime: props.game.currentTime-1});
                }
            }
            
            setProgress(calcTotalLeft(props.game));
            setTotalLength(calcGameLength(props.game)); //it must be calculated once instead updating every sec but i dont care how to realize it
        }, 1000);
        return () => clearInterval(intervalID); //prevent wrong callback from setInterval
      },[props.game]);  
    

    return (
        <div className={styles.mainClocks}>
            <div className="idk">
                lvl:{props.game.currentLevel}<br></br>
                {props.game.currentTime}
            </div>
            <div className={styles.progressBar}>
                <div className={styles.backLine}></div>
                <div style={{width: 
                    progress >= 5 ? progress*100/totalLength +"%" : "5px"
                    }} className={styles.progressLine}></div>

            </div>
            <div className={styles.buttons}>
                {props.game.isGameGoing ? <img src={process.env.PUBLIC_URL + "/images/pause.svg"} alt="" /> : <img src={process.env.PUBLIC_URL + "/images/play.svg"} alt="" />}
            </div>
        </div>
    )
}

export default MainClocks;