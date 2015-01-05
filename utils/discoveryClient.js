var request = require('request');

var DiscoveryClient = function(config){
  this.discoveryIp = config.discoveryIp;
  this.opts = {};
  this.opts.ip = config.ip;
  this.opts.id = config.id;
  this.opts.role = config.role;
  this.opts.subrole = config.subrole;
  this.register();
};

DiscoveryClient.prototype.register = function(opts){
  if(!opts){
    opts = this.opts;
  };
  request({
    method: 'POST',
    url: this.discoveryIp + '/register',
    json: true,
    body: opts
  }, function(err){
    if(err){
      console.log('err registering with Discovery Server')
      setTimeout(this.register.bind(this), 2000)
    }else{
      console.log('registered with Discovery Server')
    }
  }.bind(this))
};

DiscoveryClient.prototype.discover = function(role, subrole, cb){
  request({
    method: 'POST',
    url: this.discoveryIp + '/discover/' + role + '/' + subrole
  }, cb)
};

module.exports = DiscoveryClient;
