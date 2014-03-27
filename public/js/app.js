'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
    'ngRoute'
  , 'ngResource'
  , 'ui.bootstrap'
  , 'googlechart'

  , 'myApp.controllers'
  , 'myApp.filters'
  , 'myApp.services'
  , 'myApp.directives'

  // 3rd party dependencies
  // , 'angularFileUpload'
  , 'decipher.tags'
  , 'ui.select2'
  // , 'btford.socket-io'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/timers',
      controller: 'TimersCtrl'
    }).
    when('/projects', {
      templateUrl: 'partials/projects',
      controller: 'ProjectsCtrl'
    }).
    when('/reports', {
      templateUrl: 'partials/reports',
      controller: 'ReportsCtrl'
    }).
    when('/settings', {
      templateUrl: 'partials/settings',
      controller: 'SettingsCtrl'
    }).
    // when('/projects/:projectId', {
    //   templateUrl: 'partials/project',
    //   controller: 'ProjectCtrl'
    // }).
    // when('/socket', {
    //   templateUrl: 'partials/socket-im',
    //   controller: 'SocketImCtrl'
    // }).
    // when('/login', {
    //   templateUrl: 'partials/login',
    //   controller: 'LoginCtrl'
    // }).
    otherwise({
      redirectTo: '/projects'
    });

  $locationProvider.html5Mode(true);
})

angular.module('myApp.controllers', [])