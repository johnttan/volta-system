var fs = require('fs');

module.exports = function(data){
  fs.appendFileSync('logs.txt', JSON.stringify(data) + '\n');
};
