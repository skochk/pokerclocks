import React,{useState} from 'react';
import styles from './styles.module.scss';
import uuid4 from "uuid4";



function CellCoponent(props) {
  const [isFilled,setFilled] = useState(true);

  let isInputEmpty = (evt,key)=>{
    console.log(evt.currentTarget.textContent,key);
    if (evt.currentTarget.textContent.trim().length == 0) {
      console.log('empty input')
      setFilled(false);
    }else{
      props.handleInput(props.data._id,key,evt.currentTarget.textContent);
      console.log('input filled')
      setFilled(true);
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
                    className={isFilled ? styles.cell : styles.unfilled}
                    onInput={e=>isInputEmpty(e,el[0])}
                    onChange={e=>console.log(e)}
                    data-text={el[0]}
                    key={uuid4()}
                    suppressContentEditableWarning={true}
                   >
                    {el[1]}
                  </div>
          }
      })}

    </div>
  )
}

export default CellCoponent;