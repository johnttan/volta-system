var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  console.log('configuring')
  $stateProvider
    .state('dashboard', {
      url: '/',
      templateUrl: 'dashboard.html',
      controller: 'DashboardController'
    })
    .state('network', {
      url: '/network',
      templateUrl: 'network.html',
      controller: 'NetworkController'
    })
})
