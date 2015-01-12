angular.module('app')
  .directive('vtNetworkGraph', function(){
    return {
      restrict: 'E',
      scope: {
        data: "="
      },
      controller: function($scope){
        var color = d3.scale.category20();
        var force = d3.layout.force()
          .charge(-120)
          .linkDistance(30)
          .size([960, 500]);
        var svg = d3.select("#networkGraph").append("svg")
          .attr("width", 960)
          .attr("height", 500);
        var link = svg.selectAll(".link")
        var node = svg.selectAll(".node")
        $scope.$watch(function(){
          return JSON.stringify($scope.data);
        }, function(newValue){
          console.log('watcher fired')
          newValue = JSON.parse(newValue);
          if(newValue){
            var graph = newValue
            force
              .nodes(graph.nodes)
              .links(graph.links)
              .start();
            link
                .data(graph.links)
              .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return Math.sqrt(d.value); });
            node
                .data(graph.nodes)
              .enter().append("circle")
                .attr("class", "node")
                .attr("r", 5)
                .style("fill", function(d) { return color(d.group); })
                .call(force.drag);
            force.on("tick", function() {
              link.attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });

              node.attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; });
            });
            node.data(graph.nodes).exit().remove();
            link.data(graph.links).exit().remove();
          };
        });
      },
      templateUrl: 'networkGraph.html',
      replace: true
    }
  })
