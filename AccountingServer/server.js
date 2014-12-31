process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env];
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
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
app.get('/discover/:nodeid/:opt', function(req, res){
  var nodeid = req.params.nodeid;
  var opt = req.params.opt;
  addressStore.discover(nodeid, opt, function(data){
    res.json(data);
  })
});

// APIs for registering node.
app.post('/register/:nodeid', function(req, res){
  var nodeid = req.params.nodeid;
  var opt = req.body;
  addressStore.register(nodeid, opt, function(err){
    if(err){
      res.sendStatus(500);
    }else{
      res.sendStatus(200);
    }
  })
})
