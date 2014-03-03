'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.factory('socket', function ($rootScope) {
  // var socket = io.connect();
  var socket = io.connect('', { 'force new connection': true });
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    },
    getSocket: function() {
      return socket;
    }
  };
})
.factory('TaskService', function ($http, $rootScope) {
  return {
    post: function (task, callback) {
      $http({
        method: "POST"
      , data: task
      , url: '/api/tasks'
      }).then(function (response) {
        callback(response)
      })
    }
  }
})
.factory('TimerService', function ($resource){
  return $resource('/api/timer/:Id'
    , { Id: "@Id"
      }
    , { 'get':
        { method: 'GET'
        , isArray: true
        }
      , 'save':
        { method: 'POST'
        }
      , 'update':
        { method: 'PUT'
        }
      }
    )
})
.factory('ProjectService', function ($resource){
  return $resource('/api/project/:Id'
    , { Id: "@Id"
      }
    , { 'get':
        { method: 'GET'
        , isArray: true
        }
      , 'save':
        { method: 'POST'
        }
      , 'update':
        { method: 'PUT'
        }
      }
    )
})
.factory('CurrentTimer', function ($resource){
  return {}
})