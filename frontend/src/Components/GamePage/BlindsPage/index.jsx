import React, { useState, useEffect ,useRef} from "react";
import styles from './styles.module.scss';
import Cell from "./BlindCell";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import uuid4 from "uuid4";
import { act } from "react-dom/test-utils";


function BlindComponent(props) {
    const [game,setGame] = useState({});
    const [isEditable,setEditable] = useState(false);
    const [blinds, setBlinds] = useState([]);
    const [unFilledList, setUnFilledList] = useState([]);

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

    function handleInput(id,key,value){
        let arr = blinds;
        arr.find(el=>{
            if(el._id == id){
                el[key] = Number(value);
            }
        });
        console.log('updated cells input',arr);
        setBlinds(arr);
    }

    function handleAddRow(index){
        let arr = Array.from(blinds); //create exactly new array to trigger blinds rerender
        arr.splice(index,0, JSON.parse(JSON.stringify(arr[index]))); // dumb way to prevent mutable object
        arr[index+1]._id = arr[index]._id.slice(0,arr[index]._id.length-2) + Math.floor(Math.random() * 101 + 10);
        console.log('handleAddRow:',arr);
        setBlinds(arr);
    }
    
    function handleRemoveRow(index,id){
        // if cells unfilled and later removed need to delete this cells from unfilled list
        if(id){
            handleUnfilledList('del',id,"time");
            handleUnfilledList('del',id,"smallBlind");
            handleUnfilledList('del',id,"bigBlind");
        }
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
        await setBlinds(temp.levelStructure);
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
    function handleUnfilledList(action,id,key){
        // console.log("handle unfilled",action,id,key)
        if(action == "add"){
            setUnFilledList(arr=>[...arr,{id:id,key:key}]);
        }else if(action = "del"){
            unFilledList.map((el,index)=>{
                if(el.id == id && el.key == key){
                    let updatedUnfilledList = Array.from(unFilledList);
                    updatedUnfilledList.splice(index,1);
                    setUnFilledList(updatedUnfilledList);
                }
            })
        }
    }

    return(
        <div className={isEditable ? [styles.table,styles.editableTable].join(' ') : styles.table}>
         
            {isEditable ? 
            <>
            <div className={styles.editRowsTitle}>
                <div className={styles.column}>Level</div>
                <div className={styles.column}>Time</div>
                <div className={styles.column}>Small Blind</div>
                <div className={styles.column}>Big Blind</div>
            </div>   
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="list-container" >
                    {(provided) => (
                        <div className="list-container" {...provided.droppableProps} ref={provided.innerRef}>
                        {blinds ? blinds.map((el,index)=>(
                        <div className={styles.numberedRow}>
                            <div className={styles.rowNumber}>{index+1}</div>
                            <Draggable key={el._id} draggableId={el._id} index={index}>
                                {(provided) => (
                                    <div className={styles.row} 
                                        key={el._id} 
                                        ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}
                                    >
                                        <Cell data={el.time} _id={el._id} dataText="time" handleInput={handleInput} updateUnfilled={handleUnfilledList}/>
                                        <Cell data={el.smallBlind} _id={el._id} dataText="smallBlind" handleInput={handleInput} updateUnfilled={handleUnfilledList}/>
                                        <Cell data={el.bigBlind} _id={el._id} dataText="bigBlind" handleInput={handleInput} updateUnfilled={handleUnfilledList}/>
                                        <div className={styles.editRowsButtons}>
                                            <div className={styles.add} onClick={e=>handleAddRow(index)}>+</div>
                                            <div className={styles.remove} onClick={e=>handleRemoveRow(index,el._id)}>+</div>
                                            <img src={process.env.PUBLIC_URL + "/images/threedots.png"} alt="timer" />
                                        </div>
                                    </div>
                                
                                )}
                            </Draggable>
                            </div>
                        )) : null}
                    {provided.placeholder}
                    </div>
                    )}
                </Droppable>
            </DragDropContext>
            </>
            :
            <div>
                <div className={styles.editRowsTitle}>
                    <div className={styles.column}>Level</div>
                    <div className={styles.column}>Time</div>
                    <div className={styles.column}>Blinds</div>
                </div>
                <div className={styles.blindsTableViewMode}>
                    {blinds && blinds.map((el,index)=>(
                        <div className={index+1 == game.currentLevel ? [styles.viewTableRow, styles.activeRow].join(" ") : styles.viewTableRow} key={el._id}>
                            <div className={styles.element}>{index+1}</div>
                            <div className={styles.element}>{el.time}'</div>
                            <div className={styles.element}>{el.smallBlind}/{el.bigBlind}</div>
                        </div>
                    ))}
                </div>
            </div>         
            }                     


            <div className={styles.editButtons}>
                {isEditable ?
                    <div>
                        <button disabled={unFilledList.length ? true : false} onClick={e=>saveBlindsUpdate()}>Save changes</button>
                        <button onClick={e=>discardBlindsUpdate()}>Discard changes</button>
                    </div> : null
                }
                <img src={process.env.PUBLIC_URL+"/images/edit.png"} alt="edit" className={styles.edit} onClick={e=>handleEditEditable()}/>
            </div>
          
        </div>
    )
}

export default BlindComponent;