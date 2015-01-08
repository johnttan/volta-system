module.exports = function(bids, supply, margin, blockDuration){
  var energyDemand = 0;
  var energySupply = 0;
  var controls = [];
  var cost = 0;
  var newSupply = [];
  for(key in supply){
    if(supply.hasOwnProperty(key)){
      newSupply.push(supply[key])
    }
  };
  bids.forEach(function(bid){
    energyDemand += bid.energy;
  });

  newSupply.sort(function(a, b){
    return a.pricePerMWH - b.pricePerMWH;
  });

  var supplyReached = false;
  var i = 0;
  while(controls.length < newSupply.length && !supplyReached){
    var current = newSupply[i];
    if(!current){
      throw new Error('Not enough energy supply');
    };
    if(current.maxCapacity + energySupply >= energyDemand){
      supplyReached = true;
      productionGoal = energyDemand - energySupply;
    }else{
      productionGoal = current.maxCapacity;
    };
    energySupply += productionGoal;
    controls.push({
      producerId: current.producerId,
      productionGoal: productionGoal
    });
    cost += current.pricePerMWH * productionGoal / current.maxCapacity;
    i++;
  };
  if(!supplyReached){
    throw new Error('Not enough energy supply');
  };
  reporter.report('pricing', function(){return {
    energyDemand: energyDemand,
    energySupply: energySupply,
    cost: cost
  }});
  return {
    controls: controls,
    price: (cost / bids.length) + margin
  }
};

// var testBids = [
//   {
//     price: 10,
//     energy: 12
//   },
//   {
//     price: 9,
//     energy: 20
//   }
// ];
// var testSupply = {
//   100: {
//     producerId: 100,
//     pricePerMWH: 1,
//     maxCapacity: 35,
//     minCapacity: 0.5
//   },
//   101: {
//     producerId: 101,
//     pricePerMWH: .5,
//     maxCapacity: 10,
//     minCapacity: 0.5
//   }
// }

// console.log(module.exports(testBids, testSupply, 1, 1000000));
