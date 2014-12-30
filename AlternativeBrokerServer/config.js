exports.development = {
  port: 8011,
  settlementTimePercentage: .50,
  systemIp: 'localhost:8000/brokers'
};

exports.production = {
  port: process.env.PORT
};


