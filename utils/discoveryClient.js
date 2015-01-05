var request = require('request');

var DiscoveryClient = function(discoveryIp, ip, id, role, subrole){
  this.discoveryIp = discoveryIp;
  this.opts = {};
  this.opts.ip = ip;
  this.opts.id = id;
  this.opts.role = role;
  this.opts.subrole = subrole;
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
      setTimeout(this.register.bind(this), 2000)
    }
  }.bind(this))
};

DiscoveryClient.prototype.discover = function(role, subrole, cb){
  request({
    method 'POST',
    url: this.discoveryIp + '/discover/' + role + '/' + subrole,

  })
};
