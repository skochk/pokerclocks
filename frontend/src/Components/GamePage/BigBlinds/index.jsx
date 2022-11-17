import React from 'react';
import styles from './styles.module.scss'

function BigBlindsComponent(props) {
    // if(Object.keys(props.game).length) console.log(props.game.currentLevel,props.game.levelStructure[props.game.currentLevel-1].smallBlind,props.game.levelStructure[props.game.currentLevel-1].bigBlind)
    return (
    <div className={styles.contentArea}>
            {Object.keys(props.game).length ? 
                <div className={styles.blinds}>
                    <div className={styles.blindRow}><p>{props.game.levelStructure[props.game.currentLevel-1].smallBlind}</p> SMALL BLIND</div>
                    <div className={styles.blindRow}><p>{props.game.levelStructure[props.game.currentLevel-1].bigBlind}</p> BIG BLIND</div>
                </div>
            
            : null}
    </div>
    )
}

export default BigBlindsComponent;