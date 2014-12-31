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

