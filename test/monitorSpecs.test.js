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
    expect(monitor.config).to.equal(1);
  });

});
