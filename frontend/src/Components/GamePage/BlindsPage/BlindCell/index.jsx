import React,{useState} from 'react';
import styles from './styles.module.scss';
import uuid4 from "uuid4";

function CellCoponent(props) {
  const [alert,setAlert] = useState(false);

  let isInputEmpty = (evt,key)=>{
    console.log(evt.currentTarget.textContent,key);
    if (evt.currentTarget.textContent.trim().length == 0) {
      setAlert(true);
    }else{
      props.handleInput(props.data._id,key,evt.currentTarget.textContent);
      setAlert(false);
    }
  }
  return (
    <div className={styles.rows} id={props.data._id}>
      {
      Object.entries(props.data).map(el=>{
        if(el[0] !== "_id"){
          return <div
                    contentEditable={props.isEditable} 
                    onKeyPress={(event) => {if(!/[0-9]/.test(event.key)){event.preventDefault();}}}
                    className={styles.rows}
                    onInput={e=>isInputEmpty(e,el[0])}
                    onChange={e=>console.log(e)}
                    data-text={el[0 ]}
                    key={uuid4()}
                   >
                    {el[1]}
                  </div>
          }
      })}

    </div>
  )
}

export default CellCoponent;