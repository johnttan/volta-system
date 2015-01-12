// angular.module('app')
//   .controller('NetworkController', function($scope, AggregationService){
//     $scope.data = {
//       nodes: [],
//       links: []
//     };
//     AggregationService.addUpdate(function(){
//       if(AggregationService.aggregations){
//         var data = $scope.data;
//         var consumers = AggregationService.aggregations.consumers || {};
//         var producers = AggregationService.aggregations.producers || {};
//         var brokers = AggregationService.aggregations.brokers || {};
//         data.nodes.push({
//           name: 'system',
//           group: 2
//         });
//         data.links.push({
//           source: 'system',
//           target: 'accounting'
//         })
//         data.nodes.push({
//           name: 'discovery',
//           group: 2
//         });
//         data.nodes.push({
//           name: 'accounting',
//           group: 2
//         });
//         data.links.push({
//           source: 'accounting',
//           target: 'discovery'
//         })
//         Object.keys(brokers).forEach(function(el){
//           data.nodes.push({
//             name: 'broker',
//             group: 2
//           });
//           data.links.push({
//             source: 'broker',
//             target: 'discovery'
//           })
//         });
//         Object.keys(consumers).forEach(function(el){
//           data.nodes.push({
//             name: el,
//             group: 1
//           });
//           data.links.push({
//             source: el,
//             target: 'broker'
//           })
//           data.links.push({
//             source: el,
//             target: 'system'
//           })
//           data.links.push({
//             source: el,
//             target: 'accounting'
//           })
//           data.links.push({
//             source: el,
//             target: 'discovery'
//           })
//         });
//         Object.keys(producers).forEach(function(el){
//           data.nodes.push({
//             name: el,
//             group: 2
//           })
//           data.links.push({
//             source: el,
//             target: 'system'
//           })
//           data.links.push({
//             source: el,
//             target: 'accounting'
//           })
//           data.links.push({
//             source: el,
//             target: 'discovery'
//           })
//         });
//       }
//     })
//   })
