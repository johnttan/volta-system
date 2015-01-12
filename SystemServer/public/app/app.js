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
      url: '/'
    })
    .state('network', {
      url: '/network'
    })
})
