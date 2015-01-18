var exec = require('child_process').exec;
var _ = require('lodash');

var AzureClient = function(readyCB){
  this.sites = {};
  this.list(readyCB);
};

AzureClient.prototype.list = function(cb) {
  cb = cb || function(){};
  exec('azure site list --json', function(err, out, stderr){
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
  if(this.sites[name]){
    exec('azure site start ' + name, function(err, out){
      if(err){
        cb(false)
      }else{
        cb(true)
      }
    })
  }else{
    cb(false)
  }
};

AzureClient.prototype.stop = function(name, cb){
  if(this.sites[name]){
    exec('azure site stop ' + name, function(err, out){
      if(err){
        cb(false)
      }else{
        cb(true)
      }
    })
  }else{
    cb(false)
  }
};

AzureClient.prototype.stopAll = function(nsp, cb) {
  var numStarted = 0;
  var numStopped = 0;
  for(var key in this.sites){
    if(key.indexOf(nsp) > -1){
      numStarted ++;
      this.stop(key, function(){
        numStopped ++;
        if(numStopped === numStarted){
          cb(true)
          this.list()
        }
      }.bind(this))
    }
  }
};

AzureClient.prototype.startAll = function(nsp, cb) {
  var numStarted = 0;
  var numStopped = 0;
  for(var key in this.sites){
    if(key.indexOf(nsp) > -1){
      numStarted ++;
      this.start(key, function(){
        numStopped ++;
        if(numStopped === numStarted){
          cb(true)
          this.list()
        }
      }.bind(this))
    }
  }
};

var test = new AzureClient(function(){
  test.stopAll('volta', function(){
    console.log('stoppedAll');
  })
});

