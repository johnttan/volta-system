exports.development = {
  port: 8011,
  settlementTimePercentage: .50,
  systemIp: 'http://localhost:8000/brokers',
  brokerFeePercent: .1,
  discountPercent: .5,
  ip: 'http://104.40.181.157:8001',
  discoveryIp: 'http://localhost:9000',
  id: 25,
  role: 'system',
  subRole: 'broker'
};

exports.production = {
  port: process.env.PORT
};


