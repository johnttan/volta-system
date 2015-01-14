angular.module('app')
  .directive('vtTransaction', function(){
    return {
      restrict: 'E',
      scope: {
        data: "="
      },
      templateUrl: 'transaction.html',
      replace: true
    }
  })
