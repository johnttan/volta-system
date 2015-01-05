process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env];
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var addressStore = new (require('./addressStore'))(config)
// Setup reporter
var reporter = new (require('../utils/adminReporter'))();
global.reporter = reporter;
// Setup middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(config.port);

// Serve admin
app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html')
});

// APIs for discovery of nodes.
app.get('/discover/:role/:subrole', function(req, res){
  var role = req.params.role;
  var subrole = req.params.subrole;
  addressStore.discover(role, subrole, function(err, data){
    if(err){
      res.sendStatus(404);
    }else{
      res.json(data);
    }
  })
});

// APIs for registering node.
app.post('/register', function(req, res){
  var opt = req.body;
  addressStore.register(opt, function(err){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }else{
      console.log(req.body, 'registered')
      res.sendStatus(200);
    }
  })
});

console.log('Starting Discovery Server at', config.port);
