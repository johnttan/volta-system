var expect = require('chai').expect;
var Monitor = require('../monitor/monitor')
var testConfig = {
  port: 8000,
  maxConsumers: 10,
  maxNumBids: 10,
  biddingDuration: 3000,
  blockDuration: 1500,
  maxPrice: 1,
  minPrice: 100,
  margin: 1,
  defaultPriceAndControl: 'verticalDemandAndStepwiseSupply'
};
describe("Monitor setup", function(){
  var monitor;
  beforeEach(function(){
     monitor = new Monitor(testConfig)
  })
  it("should set config", function(){
    expect(monitor.config).to.equal(testConfig);
  });
  it("should set deltas", function(){
    expect(monitor.deltas).to.be.an('object');
  });
});
describe("Monitor.consume", function(){
  var monitor;
  var consumption = {
    currentConsumption: 10
  };

  beforeEach(function(){
     monitor = new Monitor(testConfig)
  })
  it("should initialize deltas to consumerId", function(){
    var receipt = {
      consumerId: 10,
      energy: 20
    };
    monitor.consume(consumption, receipt);
    expect(monitor.deltas[receipt.consumerId]).to.be.an('object');
  });
  it("should set delta for specified consumer", function(){
    var receipt = {
      consumerId: 10,
      energy: 20
    };
    monitor.consume(consumption, receipt);
    expect(monitor.deltas[receipt.consumerId].delta).to.equal(-10)
  });
});
