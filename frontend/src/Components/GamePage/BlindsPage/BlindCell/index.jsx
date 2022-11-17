import React,{useState, useEffect} from 'react';
import styles from './styles.module.scss';
import uuid4 from "uuid4";



function CellCoponent(props) {
  const [isFilled,setFilled] = useState(true);
  const [inputValue,setInputValue] = useState("");
  useEffect(()=>{
    setInputValue(props.data);
  },[props.data])

  let isInputEmpty = (evt,key)=>{
    console.log("event text value:",evt.currentTarget.value,key);
    if (evt.currentTarget.value.trim().length == 0) {
      setInputValue(evt.currentTarget.value);
      setFilled(false);
      props.updateUnfilled("add",props._id,props.dataText)
    }else{
      setInputValue(evt.currentTarget.value);
      props.handleInput(props._id,key,evt.currentTarget.value);
      props.updateUnfilled("del",props._id,props.dataText)
      setFilled(true);
    }
  }

  return (
    <div className={styles.rows} id={props.data._id}>
      <input
        type="number"
        className={isFilled ? styles.cell : styles.unfilled}
        onInput={e=>isInputEmpty(e,props.dataText)}
        data-text={props.dataText}
        suppressContentEditableWarning={true}
        value={inputValue}
      />
    </div>
  )
}

export default CellCoponent;