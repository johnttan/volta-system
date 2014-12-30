exports.development = {
  port: 8011,
  settlementTimePercentage: .50
};

exports.production = {
  port: process.env.PORT
};


