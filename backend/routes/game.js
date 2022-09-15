var express = require('express');
var router = express.Router();
router.post('/', function(req, res, next) {
  // console.log("params:",req.params.id)
  // var io = req.app.get('socketio');;
  // // console.log("io:",io);
  // // res.render('index', { title: 'Express' });
  // io.on( "connection", function( socket ) {
  //   socket.join(req.params.id);
  // });
  console.log(req.body);
  res.send('OK,fine');
  // try{
  //   // io.join(req.param.id)
  // }catch{(err)=>console.log(err)}
});

module.exports = router;
