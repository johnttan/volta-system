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

AzureClient.prototype.create = function(name, nsp, appsettings, cb){
  this._siteCommand('create', [name, '--location "West US"'], function(err, out){
    if(err){
      cb(err)
    }else{
      var started = 0;
      var stopped = 0;
      for(var setting in appsettings){
        started ++;
        this.setSetting(name, setting, appsettings[setting], function(err, out){
          stopped ++;
          if(stopped === started){
            this.restart(name, function(err){
              cb(err)
            });
          }
        }.bind(this));
      }
    }
  }.bind(this))
};

AzureClient.prototype.setSetting = function(name, key, value, cb) {
  this._siteCommand('appsetting', ['add', key+'='+value, name], cb);
};

AzureClient.prototype.start = function(name, cb){
  this._siteCommand('start', name, cb);
};

AzureClient.prototype.stop = function(name, cb){
  this._siteCommand('stop', [name, '-q'], cb);
};

AzureClient.prototype.delete = function(name, cb){
  this._siteCommand('delete', [name, '-q'], cb);
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

AzureClient.prototype.deleteAll = function(nsp, cb){
  this._siteCommandAll('delete', nsp, cb);
};

AzureClient.prototype._siteCommandAll = function(command, arg, cb){
  var numStarted = 0;
  var numStopped = 0;
  var name = arg;
  if(Array.isArray(arg)){
    name = arg[0];
  };
  for(var key in this.sites){
    if(key.indexOf(name) > -1){
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
  if(Array.isArray(arg)){
    arg = arg.join(' ');
  };
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
  // test.deleteAll('volta', function(err, out){
  //   console.log(err, out);
  // })
  // test.setSetting('volta-p8', 'SITE_TYPE', 'backend', function(err){
  //   if(err){console.log(err)};
  //   console.log('setting set')
  // });
  test.create('volta-p9', 'volta', {
    SITE_TYPE: 'backend'
  }, function(err){
    if(err){
      console.log(err)
    }
    console.log('site created')
  })
});

