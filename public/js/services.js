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
// .factory('socket', function ($rootScope) {
//   var disconnecting = false;
//   var socket = {};
//   return {
//     connect: function(url, query){
//       disconnecting = false;
//       socket = io.connect(url, query);
//     },
//     on: function(eventName, callback){
//       socket.on(eventName, function(){
//         var args = arguments;
//         if(!disconnecting){
//           $rootScope.$apply(function(){
//             callback.apply(socket, args);
//           });
//         }
//         else {
//           callback.apply(socket, args);
//         }
//       });
//     },
//     emit: function (eventName, data, callback) {
//       socket.emit(eventName, data, function(){
//         var args = arguments;
//         $rootScope.$apply(function(){
//           if (callback) {
//             callback.apply(socket, args);
//           }
//         });
//       })
//     },
//     disconnect: function(){
//       disconnecting = true;
//       socket.disconnect();
//     },
//     socket: socket
//   };
// });