exports.development = {
  port: 8000,
  cassIp: '127.0.0.1',
  cassKeyspace: 'volta'
};

exports.production = {
  port: process.env.PORT
};


