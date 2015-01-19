var exec = require("child_process").exec;

var child = exec('azure site list --json', function(err, out, stderr){
  console.log('err', err);
  console.log(typeof out, JSON.parse(out));
})
