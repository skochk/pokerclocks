var express = require('express');
const res = require('express/lib/response');
const { route } = require('.');
var router = express.Router();
let gameController = require('../controllers/gameApi');



router.post('/createGame', function(req, res) {
    //add validation
    (async function(){
        console.log(req.body)
        let newGame = await gameController.registerNewGame(req.body);
        res.send(newGame);
    })()
});


router.post('/load', function(req,res){
    console.log(req.body);
    (async()=>{
      let result = await gameController.getGame(req.body.code.toUpperCase());
      res.send(result || {errorMessage:"Game not exist"});
    })();
});

router.post('/test', function(req,res){
    (async function(){
        console.log(req.body);
        let result = await gameController.updateGameInfo(req.body);
        // res.send(result || {errorMessage:"Game not exist"});
    })()
        
});

router.get('/',function(){
    res.send('loaded')
});

module.exports = router;
 