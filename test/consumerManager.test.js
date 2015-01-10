var expect = require('chai').expect;
var ConsumerManager = require('../SystemServer/consumerManager');
var testConfig = require('./stubs').config;
globals.aggregator = {
  report: function(){}
};
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
  it("should have getLatestBid method", function(){
    expect(consumerManager).to.respondTo('getLatestBid');
  })
});

makeSuite("consumerManager setup", function(consumerManager){
  var marketArgs = [];
  var marketStub = {
    on: function(e, cb){
      marketArgs[0] = e;
      marketArgs[1] = cb;
    }
  };

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

makeSuite("consumerManager.addConsumer", function(consumerManager){
  var events = {};
  var consumerMock = {
    on: function(e, cb){
      events[e] = cb;
    }
  };
  consumerManager.addConsumer(consumerMock);
  it("should add listeners for events 'bid' and 'consume'", function(){
    expect(events['bid']).to.be.be.a('function');
    expect(events['consume']).to.be.a('function');
  });
});

makeSuite("consumerManager.bid", function(consumerManager){
  var marketBidCalled = false;
  var consumerManager = new ConsumerManager(testConfig, {
    on: function(){
    },
    bid: function(){
      marketArgs = true;
      return true;
    }
  }, {consume: function(){}});

  var events = {};
  var consumerMock = {
    on: function(e, cb){
      events[e] = cb;
    },
    id: 1
  };
  var bidStub = {
    energy: 10,
    price: 10,
    consumerId: 1
  };
  consumerManager.addConsumer(consumerMock);
  consumerManager.bid(bidStub);
  it("should call _market.bid on bid call", function(){
    expect(consumerManager.getLatestBid(bidStub.consumerId)).to.equal(bidStub);
  });
});
