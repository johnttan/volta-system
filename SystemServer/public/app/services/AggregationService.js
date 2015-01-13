angular.module('app')
  .factory('AggregationService', function(){
    var aggSocket = io('/aggregation');
    var aggregations = {};
    var result = {
      aggregations: aggregations,
      d3nodes: {
        nodes: [],
        links: []
      },
      update: [],
      addUpdate: function(updater){
        result.update.push(updater);
      }
    };
    aggSocket.on('aggregations', function(data){
      for(var key in data){
        aggregations[key] = data[key]
      };
      var d3nodes = generateD3Nodes(aggregations);
      result.d3nodes.nodes = d3nodes.nodes;
      result.d3nodes.links = d3nodes.links;
      console.log(result.d3nodes);
      console.log(aggregations);
      result.update.forEach(function(updater){
        if(updater){
          updater();
        }
      })
    });
    return result;
  });

function generateD3Nodes(aggregations){
  var data = {
    nodes: [],
    links: []
  };
  var consumers = aggregations.consumers || {};
  var producers = aggregations.producers || {};
  var brokers = aggregations.brokers || {};
  var linksIndices = {};
  data.nodes.push({
    name: 'system',
    group: 2,
    radius: 45,
    x: 600,
    y: 50
  });
  linksIndices['system'] = data.nodes.length - 1;
  data.nodes.push({
    name: 'discovery',
    group: 2,
    radius: 45,
    x: 600,
    y: 200
  });
  linksIndices['discovery'] = data.nodes.length-1;
  data.nodes.push({
    name: 'accounting',
    group: 2,
    radius: 45,
    x: 600,
    y: 350
  });
  linksIndices['accounting'] = data.nodes.length-1;
  if(brokers.ids){
    Object.keys(brokers.ids).forEach(function(el){
      data.nodes.push({
        name: 'broker',
        group: 2,
        radius: 25,
        x: 350,
        y: 200
      });
      linksIndices['broker'] = data.nodes.length-1;
    });
  };
  if(consumers.ids){
    var consumerYstart = 50;
    var consumerX = 250;
    Object.keys(consumers.ids).forEach(function(el){
      data.nodes.push({
        name: el,
        group: 1,
        radius: 10,
        x: consumerX,
        y: consumerYstart
      });
      consumerYstart += 50;
      var ind = data.nodes.length-1;
      data.links.push({
        source: ind,
        target: linksIndices['broker']
      })
      data.links.push({
        source: ind,
        target: linksIndices['system']
      })
      data.links.push({
        source: ind,
        target: linksIndices['accounting']
      })
      data.links.push({
        source: ind,
        target: linksIndices['discovery']
      })
    });
  };
  if(producers.ids){
    var producerYstart = 50;
    var producerX = 800;
    Object.keys(producers.ids).forEach(function(el){
      data.nodes.push({
        name: el,
        group: 3,
        radius: 5,
        x: producerX,
        y: producerYstart
      });
      producerYstart += 10;
      var ind = data.nodes.length-1;
      data.links.push({
        source: ind,
        target: linksIndices['system']
      });
      data.links.push({
        source: ind,
        target: linksIndices['accounting']
      });
      data.links.push({
        source: ind,
        target: linksIndices['discovery']
      });
    });
  };
  data.links.push({
    source: linksIndices['system'],
    target: linksIndices['accounting'],
    value: 50
  });
  data.links.push({
    source: linksIndices['system'],
    target: linksIndices['discovery'],
    value: 50
  });
  data.links.push({
    source: linksIndices['accounting'],
    target: linksIndices['discovery'],
    value: 50
  });
  data.links.push({
    source: linksIndices['broker'],
    target: linksIndices['discovery'],
    value: 50
  });
  data.links.push({
    source: linksIndices['broker'],
    target: linksIndices['accounting'],
    value: 50
  });
  data.links.push({
    source: linksIndices['broker'],
    target: linksIndices['system'],
    value: 50
  });

  return data;
};
