exports.development = {
  port: 8011,
  settlementTimePercentage: .50,
  systemIp: 'http://localhost:8000/brokers',
  brokerFeePercent: .1,
  discountPercent: .5,
  ip: 'http://localhost:8011',
  discoveryIp: 'http://localhost:9000',
  id: 25,
  role: 'system',
  subRole: 'broker'
};

exports.production = {
  port: process.env.PORT
};


