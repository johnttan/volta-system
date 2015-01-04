var config = require('./spinupConfig.js');
var DistMan = require('distmanager');

var dist = new DistMan(config);
dist.start();
