const res = require('express/lib/response');
let gameModel = require('../models/game.js')


//add method here check does game CODE exist already 
function generateCode(){
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    let result = '';
    for(let i = 0; i < 5; i++){
        result +=characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports.registerNewGame = async(data)=>{
    try{
        const newGame = new gameModel({
            code: generateCode(),
            chipstack: data.chipstack,
            levelStructure: data.levelStructure,
            currentLevel: data.currentLevel,
            currentTime: data.currentTime,
            lastTimestamp: data.lastTimestamp,
            isGameGoing: data.isGameGoing,
            // blindsStructure: data.blindsStructure
        })
        console.log(data)
        await newGame.save();
        return newGame;
    }catch(err){
        throw err;
    }
}

module.exports.updateGameInfo = async(data)=>{
    let filter = {code: data.code};
    console.log("updateGameInfo ",data.code, JSON.stringify(data))
    try{
        let updatedGame = await gameModel.findOneAndUpdate(filter,data, {new: true})
        return updatedGame;
    }catch(err){
        throw err;
    }
}

module.exports.getGame = async(code)=>{
    try{
        let gameInfo = await gameModel.findOne({code:code});
        return gameInfo;
    }catch(err){
        throw err;    
    }
}

module.exports.updateGameByTimestamp = function(game){
    let obj = game;
    let timeGone = Math.round((Date.now() - obj.lastTimestamp)/1000);
    if(obj.currentTime > timeGone){
        obj.currentTime -= timeGone;
        return obj;
    }else{
        timeGone -= obj.currentTime;
        obj.currentLevel +=1;
        //next lvl
        for(let i = obj.currentLevel-1;i<obj.levelStructure.length;i++){
            if(obj.levelStructure[i].time > timeGone){
                obj.currentTime = obj.levelStructure[i].time - timeGone;
                return obj;
            }else{
                timeGone -= obj.levelStructure[i].time;
                obj.currentLevel += 1;
            }
        }
    }
    return obj;
}   