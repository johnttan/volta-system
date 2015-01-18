var spawn = require('child_process').spawn;

if (process.env.AGENT === "system") {
  console.log("choosing system run script");
  spawn('node', ['SystemServer/server.js']);	
} else if (process.env.AGENT === "broker") {
  console.log("choosing broker run script");
  spawn('node', ['AlternativeBrokerServer/server.js']);
} else {
  console.log("AGENT variable should be set to system or broker")
}