const res = require('express/lib/response');
let gameModel = require('../models/game.js')


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
        await newGame.save();
        return newGame;
    }catch(err){
        throw err;
    }
}