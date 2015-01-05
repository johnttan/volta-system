exports.development = {
  port: 9000,
  mongoIp: 'mongodb://localhost/test'
};

exports.production = {
  port: process.env.PORT
};


