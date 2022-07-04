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
    console.log('got controller');

    try{
        let updatedGame = await gameModel.findOneAndUpdate(filter,data, {new: true})
        console.log('result controller: ',updatedGame)
        return updatedGame;
    }catch(err){
        throw err;
    }
}