exports.development = {
  port: 8010,
  cassIp: '127.0.0.1',
  cassKeyspace: 'volta'
};

exports.production = {
  port: process.env.PORT
};


