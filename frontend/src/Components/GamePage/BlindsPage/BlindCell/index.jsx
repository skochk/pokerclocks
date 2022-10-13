import React,{useState} from 'react';
import styles from './styles.module.scss';



function CellCoponent(props) {
  const [alert,setAlert] = useState(false);



  let isInputEmpty = (evt)=>{
    console.log(evt.currentTarget.textContent);
    if (evt.currentTarget.textContent.trim().length == 0) {
      setAlert(true);
    }else{
      setAlert(false);
    }
  }

  return (<div className={styles.rows}>
    <div
      contentEditable={props.isEditable} 
      data-text={props.column}
      onKeyPress={(event) => {if(!/[0-9]/.test(event.key)){event.preventDefault();}}}
      className={styles.rows}
      onInput={isInputEmpty}
    >
      {props.data}
    </div>
    {alert ? 
      <div
      className={styles.alert}>
        Field cannot be empty!
      </div>
    : null}
  </div>)
}

export default CellCoponent;