exports.development = {
  port: 8000,
  maxConsumers: 10,
  maxNumBids: 10,
  biddingDuration: 3000,
  blockDuration: 1500,
  maxPrice: 100,
  minPrice: 1,
  margin: 1,
  defaultPriceAndControl: 'verticalDemandAndStepwiseSupply'
};

exports.production = {
  port: process.env.PORT,
  maxConsumers: 10,
  maxNumBids: 10,
  biddingDuration: 3000,
  blockDuration: 1500,
  maxPrice: 100,
  minPrice: 1,
  margin: 1,
  defaultPriceAndControl: 'verticalDemandAndStepwiseSupply'

};


