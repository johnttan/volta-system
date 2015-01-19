var exec = require('child_process').exec;
var _ = require('lodash');
var prompt = require('prompt');

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
  this._siteCommand('create', [name, '--location "West US"', '--git'], function(err, out){
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
  console.log('running all')
  var numStarted = 0;
  var numStopped = 0;
  var name = arg;
  if(Array.isArray(arg)){
    name = arg[0];
  };
  var ran = false;
  for(var key in this.sites){
    if(key.indexOf(name) > -1){
      ran = true;
      numStarted ++;
      this[command](key, function(err, out){
        numStopped ++;
        if(numStopped === numStarted){
          cb(err, out)
          this.list()
        }
      }.bind(this))
    }
  };
  if(!ran){
    cb();
  }
};

AzureClient.prototype._siteCommand = function(command, arg, cb){
  if(Array.isArray(arg)){
    arg = arg.join(' ');
  };
  var command = 'azure site ' + command + ' ' + arg;
  console.log(command);
  exec(command, function(err, out){
    if(err){
      cb(err)
    }else{
      cb(null, out)
    }
  })
};

function pushAll(urls){
  var started = 0;
  var stopped = 0;
  urls.forEach(function(url){
    started ++;
    console.log('pushing', url.name);
    exec('git push ' + url.name + ' master', function(err, out){
      stopped ++;
      if(stopped === started){
        console.log('pushed all')
      }
    })
  })
};

function setupGitAndPush(urls){
  var started = 0;
  var done = 0;
  urls.forEach(function(url){
    started ++;
    console.log('removing', url.name);
    exec('git remote remove ' + url.name, function(err, out){
      done ++;
      if(done === started){
        urls.forEach(function(url){
          started ++;
          console.log('adding', url.name);
          exec('git remote add ' + url.name + ' ' + url.url, function(err, out){
            done ++;
            if(done === started){
              pushAll(urls);
            }
          })
        })
      }
    })
  })
};

var test = new AzureClient(function(err){
  if(err){console.log(err)};
  test.deleteAll('volta', function(err){
    var completed = 0;
    var started = 0;
    for(var i=0;i<5;i++){
      (function(i){
        started ++;
        console.log('creating site')
        test.create('volta-p' + i.toString(), 'volta', {
          SITE_TYPE: i % 2 === 0 ? 'backend':'frontend'
        }, function(err){
          completed ++;
          if(err){
            console.log(err)
          };
          console.log(i, 'site created')
          if(completed === started){
            console.log('all servers created');
            test.list(function(err, data){
              var gitUrls = _(data).filter(function(el){return el.repositorySiteName.indexOf('volta') > -1}).map(function(el){
                var url = 'https://johnttan@' + el.repositorySiteName + '.scm.azurewebsites.net/' + el.repositorySiteName + '.git';
                return {url: url, name: el.repositorySiteName};
              }).value();
              console.log(data);
              setupGitAndPush(gitUrls);
            })
          }
        })
      })(i)
    }
  })
});

