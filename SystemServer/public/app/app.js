var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  console.log('configuring')
  $stateProvider
    .state('dashboard', {
      url: '/',
      templateUrl: 'dashboard.html',
      controller: function($scope) {
        console.log('scope instantiated')
      }
    })
})
