import React, { useState, useEffect ,useRef} from "react";
import styles from './styles.module.scss';
import Cell from "./BlindCell"

function BlindComponent(props) {
    const [game,setGame] = useState({});
    const [isEditable,setEditable] = useState(false);
    useEffect(()=>{
        let data = props.game;
        // data.
        setGame(props.game);
    },[props.game]);


    function handleEditEditable(){
        setEditable(isEditable=>!isEditable);
        console.log('editable:',isEditable)
    }

    function handleInput(event){
        console.log(event.currentTarget.textContent);

        // line number temporary
        // console.log(event.currentTarget.parentElement.getAttribute("lvlattr"));
    }


    return(
        <div className={isEditable ? [styles.table,styles.editableTable].join(' ') : styles.table}>
            {game.levelStructure ? game.levelStructure.map((el,index)=>{
                return <div className={index+1 == game.currentLevel ? [styles.row,styles.active].join(' ') : styles.row} key={el._id} lvlattr={index}>
                            <Cell data={el.level} isEditable={isEditable} column="Level"/>
                            <Cell data={el.time} isEditable={isEditable} column="Time"/>
                            <Cell data={el.level} isEditable={isEditable} column="SmallBigBlind"/>
                        </div>
            }) : null}

            <div className={styles.editButtons}>
                {isEditable ?
                    <div>
                        <div>Save changes</div>
                        <div>Discard changes</div>
                    </div> : null
                }
                <img src={process.env.PUBLIC_URL+"/images/edit.png"} alt="edit" className={styles.edit} onClick={e=>handleEditEditable()}/>
            </div>
            
        </div>)

}

export default BlindComponent;