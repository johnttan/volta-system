process.env.node_env = process.env.node_env || "development";

var config = require('./config')[process.env.node_env];
var express = require('express');
var app = express();
// Setup reporter
var reporter = new (require('../utils/adminReporter'))();
global.reporter = reporter;
// Setup middleware
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(config.port);

// Serve admin
app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html')
});

// Serve stats
app.get('/api/stats', function(req, res){
  res.json(reporter.update())
});

console.log("Running the server file");
console.log("node_env", process.env.node_env); //to check whether it's been set to production when deployed
