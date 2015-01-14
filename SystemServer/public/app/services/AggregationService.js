angular.module('app')
  .factory('AggregationService', function(){
    var aggSocket = io('/aggregation');
    var aggregations = {};
    var result = {
      aggregations: aggregations,
      d3nodes: {
        nodes: [],
        edges: []
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
      result.d3nodes.edges = d3nodes.edges;
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
    edges: []
  };
  var consumers = aggregations.consumers || {};
  var producers = aggregations.producers || {};
  var brokers = aggregations.brokers || {};
  data.nodes.push({
    id: 'system',
    label: 'system',
    group: 2,
    radius: 45,
    x: 300,
    y: 150
  });
  data.nodes.push({
    id: 'discovery',
    label: 'discovery',
    group: 2,
    x: 300,
    y: 250,
    radius: 45
  });
  data.nodes.push({
    id: 'accounting',
    label: 'accounting',
    x: 300,
    y: 350,
    group: 2,
    radius: 45
  });
  if(brokers.ids){
    Object.keys(brokers.ids).forEach(function(el){
      data.nodes.push({
        id: 'broker',
        label: 'broker',
        group: 2,
        radius: 25,
        x: 200,
        y: 250
      });
    });
  };
  if(consumers.ids){
    var consumerYstart = 150;
    var consumerX = 10;
    Object.keys(consumers.ids).forEach(function(el, ind){
      data.nodes.push({
        id: el,
        label: "Consumer" + ind.toString(),
        group: 1,
        radius: 10,
        x: consumerX,
        y: consumerYstart
      });
      consumerYstart += 50;
      data.edges.push({
        from: el,
        to: 'broker'
      })
      data.edges.push({
        from: el,
        to: 'system'
      })
      data.edges.push({
        from: el,
        to: 'accounting'
      })
      data.edges.push({
        from: el,
        to: 'discovery'
      })
    });
  };
  if(producers.ids){
    var producerYstart = 150;
    var producerX = 600;
    var producerCount = 1;
    Object.keys(producers.ids).forEach(function(el, ind){
      data.nodes.push({
        id: el,
        label: "Producer" + ind.toString(),
        group: 3,
        radius: 5,
        x: producerX,
        y: producerYstart
      });
      producerYstart += 10;
      data.edges.push({
        from: el,
        to: 'system'
      });
      data.edges.push({
        from: el,
        to: 'accounting'
      });
      data.edges.push({
        from: el,
        to: 'discovery'
      });
    });
  };
  data.edges.push({
    from: 'system',
    to: 'accounting',
    value: 50
  });
  data.edges.push({
    from: 'system',
    to: 'discovery',
    value: 50
  });
  data.edges.push({
    from: 'accounting',
    to: 'discovery',
    value: 50
  });
  data.edges.push({
    from: 'broker',
    to: 'discovery',
    value: 50
  });
  data.edges.push({
    from: 'broker',
    to: 'accounting',
    value: 50
  });
  data.edges.push({
    from: 'broker',
    to: 'system',
    value: 50
  });

  return data;
};
