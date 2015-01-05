exports.development = {
  port: 8010,
  cassIp: '127.0.0.1',
  cassKeyspace: 'volta',
  discoveryIp: 'http://localhost:9000',
  ip: 'http://localhost:8000',
  id: 10,
  role: 'system',
  subRole: 'accounting'
};

exports.production = {
  port: process.env.PORT
};


