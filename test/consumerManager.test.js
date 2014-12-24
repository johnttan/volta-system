var expect = require('chai').expect;
var ConsumerManager = require('../consumerManager');
var testConfig = require('./stubs').config;
function makeSuite(name, tests) {
    describe(name, function () {
        var consumerManager = new ConsumerManager(testConfig, {on: function(){}}, {consume: function(){}});
        tests(consumerManager);
    });
};
makeSuite("consumerManager methods", function(consumerManager){
  it("should have addConsumer method", function(){
    expect(consumerManager).to.respondTo('addConsumer');
  });
  it("should have bid method", function(){
    expect(consumerManager).to.respondTo('bid');
  });
});

makeSuite("consumerManager setup", function(consumerManager){
  var marketArgs = [];
  var marketStub = {on: function(e, cb){
    marketArgs[0] = e;
    marketArgs[1] = cb;
  }};

  var monitorStub = {consume: function(){}};

  consumerManager = new ConsumerManager(testConfig, marketStub, monitorStub);
  it("should set config", function(){
    expect(consumerManager.config).to.equal(testConfig);
  });
  it("should set monitor", function(){
    expect(consumerManager._monitor).to.equal(monitorStub);
  });
  it("should set market", function(){
    expect(consumerManager._market).to.equal(marketStub);
  });
  it("should call market.on with 'marketClose' event and callback", function(){
    expect(marketArgs[0]).to.equal('marketClose');
    expect(marketArgs[1]).to.be.a('function');
  })
});


