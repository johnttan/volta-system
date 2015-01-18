var exec = require('child_process').exec;
var _ = require('lodash');

var AzureClient = function(readyCB){
  this.sites = {};
  this.list(readyCB);
};

AzureClient.prototype.list = function(cb) {
  cb = cb || function(){};
  this._siteCommand('list', '--json', function(err, out){
    if(err){
      cb(err);
    }else{
      out = JSON.parse(out);
      out.forEach(function(el){
        var newSite = _.pick(el, ['name', 'hostNames', 'repositorySiteName', 'state', 'siteProperties']);
        this.sites[el.name] = newSite;
      }.bind(this));
      cb(null, this.sites)
    };
  }.bind(this))
};

AzureClient.prototype.start = function(name, cb){
  this._siteCommand('start', name, cb);
};

AzureClient.prototype.stop = function(name, cb){
  this._siteCommand('stop', name, cb);
};

AzureClient.prototype.restart = function(name, cb) {
  this._siteCommand('restart', name, cb);
};

AzureClient.prototype.stopAll = function(nsp, cb){
  this._siteCommandAll('stop', nsp, cb);
};

AzureClient.prototype.startAll = function(nsp, cb){
  this._siteCommandAll('start', nsp, cb);
};

AzureClient.prototype.restartAll = function(nsp, cb){
  this._siteCommandAll('restart', nsp, cb);
};

AzureClient.prototype._siteCommandAll = function(command, arg, cb){
  var numStarted = 0;
  var numStopped = 0;
  for(var key in this.sites){
    if(key.indexOf(arg) > -1){
      numStarted ++;
      this[command](key, function(err, out){
        numStopped ++;
        if(numStopped === numStarted){
          cb(err, out)
          this.list()
        }
      }.bind(this))
    }
  }
};

AzureClient.prototype._siteCommand = function(command, arg, cb){
  exec('azure site ' + command + ' ' + arg, function(err, out){
    if(err){
      cb(err)
    }else{
      cb(null, out)
    }
  })
};

var test = new AzureClient(function(err){
  if(err){console.log(err)};
  test.startAll('volta', function(){
    console.log('startAll');
  });
});

