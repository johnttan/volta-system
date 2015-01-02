module.exports = {
  nodes: [
    {
      name: 'discovery',
      dir: '/home/john/code/volta-system/DiscoveryServer',
      args: ['server.js']
    },
    {
      name: 'accounting',
      dir: '/home/john/code/volta-system/AccountingServer',
      args: ['server.js']
    },
    {
      name: 'consumer',
      dir: '/home/john/code/volta-consumer',
      args: ['server.js']
    },
    {
      name: 'testConsumers',
      dir: '/home/john/code/volta-system/AlternativeBrokerServer',
      args: ['testConsumers.js']
    },
    {
      name: 'producer',
      dir: '/home/john/code/volta-producer',
      args: ['server.js', 'development']
    },
    {
      name: 'broker',
      dir: '/home/john/code/volta-system/AlternativeBrokerServer',
      args: ['server.js']
    },
    {
      name: 'system',
      dir: '/home/john/code/volta-system/SystemServer',
      args: ['server.js']
    }
  ]
}
