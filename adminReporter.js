var adminReporter = function(){
  this.dataExport = [];
  this.dataStore = {};
};

// Registers a value to watch. Pass in watcher callback that when called, returns the value to store
adminReporter.prototype.register = function(key, watcher) {
  if(!this.dataStore[key]){
    this.dataStore[key] = {value:{}};
    this.dataExport.push(this.dataStore[key].value);
  };
  this.dataStore[key].watcher = watcher;
  this.dataStore[key].value.name = key;
  this.dataStore[key].value.value = watcher();
};

// Updates all values and returns array of updated key value pairs.
adminReporter.prototype.update = function() {
  for(key in this.dataStore){
    if(this.dataStore.hasOwnProperty(key)){
      this.dataStore[key].value = this.dataStore[key].watcher();
    }
  };
  console.log(JSON.stringify(this.dataExport))
  return this.dataExport;
};

module.exports = adminReporter;
