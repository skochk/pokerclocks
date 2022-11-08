import React, { useState, useEffect } from "react";
import styles from './styles.module.scss'


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
                    props.updateState(props.game);
                }else{
                    props.updateState({...props.game,currentTime: props.game.currentTime-1});
                }
            }
            
            setProgress(calcTotalLeft(props.game));
            setTotalLength(calcGameLength(props.game)); //it must be calculated once instead updating every sec but i dont care how to realize it
        }, 1000);
        return () => clearInterval(intervalID); //prevent wrong callback from setInterval
      },[props.game]);  
    
    function calcTotalLeft(game){
        let totalSec = game.currentTime;
        // console.log('calcTotalLeft:',game);
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
    function convertToMS(seconds){
        return (seconds - seconds % 60)/60 + ":" + seconds % 60;
    }
    function updatePauseState(){
        props.updateState({...props.game,isGameGoing: !props.game.isGameGoing});
        props.emitState({...props.game,isGameGoing: !props.game.isGameGoing});
    }
    function addMinuteState(){
        props.updateState({...props.game,currentTime: props.game.currentTime+60});
        props.emitState({...props.game,currentTime: props.game.currentTime+60});
    }
    function changeLvlState(direction){
        let current = props.game.currentLevel+direction-1;
        if(props.game.levelStructure[current]){
            props.updateState({...props.game,currentLevel: current+1, currentTime: props.game.levelStructure[current].time});
            props.emitState({...props.game,currentLevel: current+1, currentTime: props.game.levelStructure[current].time});
        }
    }

    return (
        <div className={styles.mainClocks}>
            <div className={styles.mainTime}>
                {convertToMS(props.game.currentTime)}
            </div>
            <div className={styles.progressBar}>
                <div className={styles.backLine}></div>
                <div style=
                    {{width: 
                    progress >= 5 ? progress*100/totalLength +"%" : "5px"
                    }} className={styles.progressLine}
                >
                </div>
                </div>
            <div className={styles.buttons}>
                <img src={process.env.PUBLIC_URL+'/images/skipnext.svg'} alt="previousLevel" className={styles.previousLevel} onClick={e=>changeLvlState(-1)}/>
                <div onClick={(e) =>updatePauseState()}>
                    {props.game.isGameGoing ? <img src={process.env.PUBLIC_URL + "/images/pause.svg"} alt="pause"  className={styles.playPause}/> : <img src={process.env.PUBLIC_URL + "/images/play.svg"} alt="play"  className={styles.playPause}/>}
                </div>
                <img src={process.env.PUBLIC_URL+'/images/skipnext.svg'} alt="previousLevel" className={styles.nextLevel}  onClick={e=>changeLvlState(1)}/>
            </div>
            <div className={styles.bottomButtons}>
                {/* <img src={process.env.PUBLIC_URL+'/images/settings.svg'} alt="settings" className={styles.settings}/> */}
                <img src={process.env.PUBLIC_URL+'/images/plusminute.svg'} alt="addMinute" className={styles.addTimeButton}  onClick={e=>addMinuteState()}/>
            </div>
        </div>
    )
}

export default MainClocks;