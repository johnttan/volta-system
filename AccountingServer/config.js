exports.development = {
  port: 8010,
  cassIp: process.args[2],
  cassKeyspace: 'volta',
  discoveryIp: 'http://104.40.181.157:8001',
  ip: 'http://localhost:8000',
  id: 22,
  role: 'system',
  subRole: 'accounting'
};

exports.production = {
  port: process.env.PORT
};


