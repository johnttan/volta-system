var spawn = require('child_process').spawn;

if (process.env.AGENT === "system") {
  spawn('node', ['SystemServer/server.js']);	
} else if (process.env.AGENT === "broker") {
  spawn('node', ['AlternativeBrokerServer/server.js'])
} else {
  console.log("AGENT variable should be set to system or broker")
}