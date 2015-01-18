var exec = require('child_process').exec;
var _ = require('lodash');

var AzureClient = function(){
  this.sites = {};
  this.list();
};

AzureClient.prototype.list = function(cb) {
  cb = cb || function(){};
  exec('azure site list --json', function(err, out, stderr){
    if(err){
      cb(err);
    }else{
      out = JSON.parse(out);
      out.forEach(function(el){
        var newSite = {};
        this.sites[el.name] = newSite;
      }.bind(this))
    };
    console.log(this.sites);
  }.bind(this))
};

AzureClient.prototype.stopAll = function(name) {

};

var test = new AzureClient();
