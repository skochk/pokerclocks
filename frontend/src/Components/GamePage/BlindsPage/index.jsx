import React, { useState, useEffect ,useRef} from "react";
import styles from './styles.module.scss';
import Cell from "./BlindCell";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import uuid4 from "uuid4";


function BlindComponent(props) {
    const [game,setGame] = useState({});
    const [isEditable,setEditable] = useState(false);
    const [blinds, setBlinds] = useState([]);
    const [isBlindsDataFilled, setBlindsDataFilled] = useState(true);

    useEffect(()=>{
        setGame(props.game);
        setBlinds(props.game.levelStructure);
    },[props.game]);

    function handleEditEditable(){
        if(isEditable == false){
            let updState = {...game,isGameGoing:false};
            setGame(updState);
            props.updateState(updState);
            props.emitState(updState);
        }
        setEditable(isEditable=>!isEditable);
    }

    function handleIsblindsFilled(bool){
        setBlindsDataFilled(bool);
    }
    function handleInput(id,key,value){
        let arr = blinds;
        arr.find(el=>{
            if(el._id == id){
                el[key] = Number(value);
            }
        });
        console.log(arr);
        setBlinds(arr);
    }

    function handleAddRow(index){
        let arr = Array.from(blinds); //create exactly new array to trigger blinds rerender
        arr.splice(index,0, JSON.parse(JSON.stringify(arr[index]))); // dumb way to prevent mutable object
        arr[index+1]._id = arr[index]._id.slice(0,arr[index]._id.length-2) + Math.floor(Math.random() * 101 + 10);
        console.log('handleAddRow:',arr);
        setBlinds(arr);
    }
    
    function handleRemoveRow(index){
        let arr = Array.from(blinds); //create exactly new array to trigger blinds rerender
        arr.splice(index,1);
        setBlinds(arr);
    }

    function saveBlindsUpdate(){

        //if current level more than blinds levels total
        let updatedGameState = {...game,levelStructure: blinds};
        if(updatedGameState.currentLevel > updatedGameState.levelStructure.length){
            updatedGameState.currentLevel = updatedGameState.levelStructure.length;
            updatedGameState.currentTime = updatedGameState.levelStructure[updatedGameState.levelStructure.length-1].time;
        }
        setGame(updatedGameState);
        props.updateState(updatedGameState);
        props.emitState(updatedGameState);
        setEditable(false);
    }

    async function discardBlindsUpdate(){
        setEditable(false);
        let temp = game;
        await setGame({});
        await setGame(temp);
        // strange way to rerender all childs 
    }

    function handleOnDragEnd(result) {
        if (!result.destination) return;
    
        const items = Array.from(blinds);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        // console.log(items);
        setBlinds(items);
    }
  
    return(
        <div className={isEditable ? [styles.table,styles.editableTable].join(' ') : styles.table}>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="list-container" >
                    {(provided) => (
                        <div className="list-container" {...provided.droppableProps} ref={provided.innerRef}>
                        {blinds ? blinds.map((el,index)=>(
                            <Draggable key={el._id} draggableId={el._id} index={index} isDragDisabled={!isEditable}>
                                {(provided) => (
                                    <div className={index+1 == game.currentLevel && !isEditable ? [styles.row,styles.active].join(' ') : styles.row} 
                                        key={el._id} 
                                        ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}
                                    >
                                        <Cell data={el} isEditable={isEditable} handleInput={handleInput}/>
                                        {isEditable ? 
                                        <div className={styles.editRowsButtons}>
                                            <div className={styles.add} onClick={e=>handleAddRow(index)}>+</div>
                                            <div className={styles.remove} onClick={e=>handleRemoveRow(index)}>+</div>
                                            <img src={process.env.PUBLIC_URL + "/images/threedots.png"} alt="timer" />
                                        </div>
                                        : null}
                                    </div>
                                
                                )}
                            </Draggable>
                        )) : null}
                    {provided.placeholder}
                    </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div className={styles.editButtons}>
                {isEditable ?
                    <div>
                        <div onClick={e=>saveBlindsUpdate()}>Save changes</div>
                        <div onClick={e=>discardBlindsUpdate()}>Discard changes</div>
                    </div> : null
                }
                <img src={process.env.PUBLIC_URL+"/images/edit.png"} alt="edit" className={styles.edit} onClick={e=>handleEditEditable()}/>
            </div>
          
        </div>
    )
}

export default BlindComponent;