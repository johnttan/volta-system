var expect = require('chai').expect;
var Monitor = require('../SystemServer/monitor/monitor')
var testConfig = require('./stubs').config;

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
  it("should set delta for specified consumer underspending", function(){
    var receipt = {
      consumerId: 10,
      energy: 20
    };
    monitor.consume(consumption, receipt);
    expect(monitor.deltas[receipt.consumerId].delta).to.equal(-10)
  });
    it("should set delta for specified consumer overspending", function(){
    var receipt = {
      consumerId: 10,
      energy: 5
    };
    monitor.consume(consumption, receipt);
    expect(monitor.deltas[receipt.consumerId].delta).to.equal(5)
  });
});
