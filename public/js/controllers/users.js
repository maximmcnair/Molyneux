// 'use strict';

/* Controllers */
angular.module('myApp.controllers')
  .controller('OnlineCtrl', function ($scope, socket) {
    //========================================================
    //  Socket - Users
    //========================================================
    socket.emit('users:join')
    socket.on('users:join', function (data) {
      $scope.name = data.name
      $scope.team = data.team
      $scope.users = data.users
      // $scope.projects = data.projects
    })
    $scope.$on('$destroy', function (event) {
      socket.getSocket().removeAllListeners('user')
      // or something like
      // socket.removeListener(this);
    })

    socket.on('users:new', function (data) {
      $scope.users.push(data.name)
    })

    // add a message to the conversation when a user disconnects or leaves the room
    socket.on('users:left', function (data) {
      var i, user
      for (i = 0; i < $scope.users.length; i++) {
        user = $scope.users[i]
        if (user === data.name) {
          $scope.users.splice(i, 1)
          break
        }
      }
    })
  })