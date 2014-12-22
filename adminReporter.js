var adminReporter = function(){
  this.dataExport = [];
  this.dataStore = {};
};

// Registers a value to watch. Pass in watcher callback that when called, returns the value to store
adminReporter.prototype.registerValue = function(key, watcher) {
  if(!this.dataStore[key]){
    this.dataStore[key] = {};
    this.dataExport.push(this.dataStore[key]);
  };
  dataStore[key].watcher = watcher;
  dataStore[key].value = {name: key, value: watcher()};
};

adminReporter.prototype.update = function() {

};

module.exports = adminReporter;
