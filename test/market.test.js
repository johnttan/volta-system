var expect = require('chai').expect;
var Market = require('../market/market');
var testConfig = require('./stubs').config;
var reporter = new (require('../utils/adminReporter'))();

global.reporter = reporter;
global.fileLog = function(){};
function makeSuite(name, tests) {
    describe(name, function () {
        var market = new Market(testConfig);
        tests(market);
    });
};

makeSuite('Market init', function(market){
  it('should setup config', function(){
    expect(market.config).to.equal(testConfig);
  });
});

makeSuite('Market.bid', function(market){
  it('should contain bid method', function(){
    expect(market).to.respondTo('bid');
  });

  it('should return false on bid when not in auction time', function(){
    var result = market.bid({
      data:[{
        price: 10,
        energy: 10
      }],
      consumerId: 10
    });
    expect(result).to.be.false;
  });
  it('should return true on bid when in state 1', function() {
    market.state = 1;
    var result = market.bid({
      data:[{
        price: 10,
        energy: 10
      }],
      consumerId: 10
    });
    expect(result).to.be.true;
  });
});

makeSuite('Market.reportSupply', function(market){
  it('should contain reportSupply method', function(){
    expect(market).to.respondTo('reportSupply');
  });

  var testSupply = {
    producerId: 1,
    energy: 10
  };

  it('should set currentSupply to producer', function() {
    market.reportSupply(testSupply);
    expect(market.currentSupply[testSupply.producerId]).to.equal(testSupply);
  });
});

makeSuite('Market.on', function(market){
  var testE = 'test';
  var cbCalled = false;
  var testFunc = function(){
    cbCalled = true;
  };

  it('should have on method', function(){
    expect(market).to.respondTo('on');
  });

  it('should register event handlers', function(){
    market.on(testE, testFunc);
    expect(market.events[testE][0]).to.equal(testFunc);
  });
});

makeSuite('Market.trigger', function(market){
  var testE = 'test';
  var cbCalled = false;
  var testFunc = function(){
    cbCalled = true;
  };
  market.on(testE, testFunc);

  it('should have method trigger', function(){
    expect(market).to.respondTo('trigger');
  });

  it('should trigger callbacks associated with event', function(){
    market.trigger(testE);
    expect(cbCalled).to.be.true;
  });
})
