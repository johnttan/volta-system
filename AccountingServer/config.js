  exports.development = {
  port: 8010,
  cassIp: '104.210.34.54',
  cassKeyspace: 'volta',
  discoveryIp: 'http://104.40.181.157:8001',
  ip: 'http://localhost:8001',
  id: 22,
  role: 'system',
  subRole: 'accounting'
};

exports.production = {
  port: process.env.PORT
};


