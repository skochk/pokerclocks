
const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;

const levelStructureSchema = new Schema({
    level: Number,
    bigBlind: Number,
    smallBlind: Number,
    time: Number, // in sec's
})

// const blindsStructureSchema = new Schema({
//     level: Number,
//     bigBlind: Number,
//     smallBlind: Number,
// })

const gameScheme = new Schema({
    code: String, // game code 
    chipstack: Number,
    levelStructure: [levelStructureSchema],
    currentLevel: Number,
    currentTime: Number, // in sec's
    lastTimestamp: Number,
    isGameGoing: {type: Boolean, default: false }, // true = game going 
    // blindsStructure: [blindsStructureSchema],
 
});




module.exports = mongoose.model("games", gameScheme);