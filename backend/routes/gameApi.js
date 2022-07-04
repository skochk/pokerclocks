var express = require('express');
const res = require('express/lib/response');
const { route } = require('.');
var router = express.Router();
let gameController = require('../controllers/gameApi');



router.post('/createGame', function(req, res) {
    //add validation
    (async function(){
        let newGame = await gameController.registerNewGame(req.body);
        res.send(newGame);
    })()
});

router.get('/',function(){
    res.send('loaded')
})
module.exports = router;
