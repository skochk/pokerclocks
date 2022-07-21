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
            blindsStructure: data.blindsStructure
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

module.exports.calcTotalLeft = function(game){
    let totalSec = game.currentTime;
    console.log("levels, current",game.levelStructure.length, game.currentLevel)
    for(let i = game.currentLevel; i<=game.levelStructure.length-1; i++){
        console.log(i, game.levelStructure[i])
        totalSec += game.levelStructure[i].time;    
    }
    return totalSec;
}

module.exports.getCurrentLvlState = function(game,timeleft){
    console.log('income data:',game,game.currentLevel,timeleft)
    let thenextlvl = 0;
    let restLvlTime = 0;
    for(let i = game.levelStructure.length-1; i>game.currentLevel-1; i--){
        console.log('loop:',i,game.levelStructure[i].time,timeleft)
        if(timeleft > game.levelStructure[i].time){
            timeleft = timeleft - game.levelStructure[i].time; 
        }else{ 
            restLvlTime = timeleft;
            thenextlvl = game.levelStructure[i].level;
        }
    }
    return {level: thenextlvl, time: restLvlTime};
}

