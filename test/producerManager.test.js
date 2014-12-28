var expect = require('chai').expect;
var ProducerManager = require('../SystemServer/producerManager');
var testConfig = require('./stubs').config;
function makeSuite(name, tests) {
    describe(name, function () {
        var producerManager;
        var marketStub = {
          reportSupply: function(supply){
            return supply;
          }
        };
        producerManager = new ProducerManager(testConfig, marketStub)
        tests(producerManager);
    });
};

makeSuite("producerManager methods", function(producerManager){
  it("should have addProducer method", function(){
    expect(producerManager).to.respondTo('addProducer');
  });
  it("should have reportSupply method", function(){
    expect(producerManager).to.respondTo('reportSupply');
  });
  it("should have getLatestSupply method", function(){
    expect(producerManager).to.respondTo('getLatestSupply');
  });

});

makeSuite("producerManager setup", function(producerManager){
  beforeEach(function(){
     producerManager = new ProducerManager(testConfig);
  });
  it("should set config", function(){
    expect(producerManager.config).to.equal(testConfig);
  });
});

makeSuite("producerManager.addProducer", function(producerManager){
  var called = false;
  var args;
  var stubbed = {
    on: function(e, cb){
      args = arguments;
      called = true;
    }
  };
  producerManager.addProducer(stubbed);
  it("should call 'on' with correct event", function(){
    expect(args[0]).to.equal('reportSupply');
  });
  it("should call 'on' with callback", function(){
    expect(args[1]).to.be.a('function');
  });
});

makeSuite("producerManager.reportSupply", function(producerManager){
  var called = false;
  var args;
  var stubbed = {
    on: function(e, cb){
      args = arguments;
      called = true;
    },
    id: 1
  };
  var supplyStub = {
    producerId: 1
  };
  producerManager.addProducer(stubbed);
  producerManager.reportSupply(supplyStub);
  it("should call reportSupply in _market with supply and store supply", function(){
    expect(producerManager.getLatestSupply(supplyStub.producerId)).to.equal(supplyStub)
  });
});
