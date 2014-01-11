'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'angularFileUpload',

  // 3rd party dependencies
  'btford.socket-io',
  'ui.bootstrap'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/projects', {
      templateUrl: 'partials/projects',
      controller: 'ProjectsCtrl'
    }).
    when('/socket', {
      templateUrl: 'partials/socket-im',
      controller: 'SocketImCtrl'
    }).
    when('/login', {
      templateUrl: 'partials/login',
      controller: 'LoginCtrl'
    }).
    otherwise({
      redirectTo: '/projects'
    });

  $locationProvider.html5Mode(true);
});