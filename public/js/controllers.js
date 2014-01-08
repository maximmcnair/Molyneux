'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ProjectsCtrl', function ($scope, socket) {
    socket.on('init', function (data) {
      $scope.name = data.name;
      $scope.users = data.users;
    })


    // Private helpers
    // ===============

    var changeName = function (oldName, newName) {
      // rename user in list of users
      var i;
      for (i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i] === oldName) {
          $scope.users[i] = newName;
        }
      }
    }

    // Methods published to the scope
    // ==============================

    $scope.changeName = function () {
      socket.emit('change:name', {
        name: $scope.newName
      }, function (result) {
        if (!result) {
          alert('There was an error changing your name');
        } else {

          changeName($scope.name, $scope.newName);

          $scope.name = $scope.newName;
          $scope.newName = '';
        }
      });
    };

    socket.on('change:name', function (data) {
      changeName(data.oldName, data.newName);
    })



    // $scope.projects = [
    //   { title: 'TreePress'
    //   , description: 'A couple laps in BMW\'s latest autonomous driving demo, taking place here at CES this week, are all it took to get me feeling a little woozy. '}
    // , { title: 'Fosters Events'
    //   , description: 'As thrilling and entertaining as the ride was, there\'s actually method to BMW\'s madness. The company notes that self-driving systems won\'t really be ready for prime time until they\'re able to handle all road situations.'}
    // , { title: 'Creo Medical'
    //   , description: 'The demonstration was an exclamation point that researchers in the auto industry are starting to get a handle on making self-driving cars practical (and safe) in even non-optimal driving conditions, but there\s still lots of work to do.'}
    // ]

    $scope.projects = []

    socket.on('send:project', function (project) {
      $scope.projects.push(project);
    });

    $scope.addProject = function () {
      socket.emit('send:project', {
        title: $scope.project.title,
        description: $scope.project.description
      });

      // add the projects to our model locally
      $scope.projects.push($scope.project)

      // clear projects box
      $scope.project = ''
    };
  })
  .controller('SocketImCtrl', function ($scope, socket) {
    // Socket listeners
    // ================
    $scope.messages = []

    socket.on('init', function (data) {
      $scope.name = data.name;
      $scope.users = data.users;
    });

    socket.on('send:message', function (message) {
      $scope.messages.push(message);
    });

    socket.on('change:name', function (data) {
      changeName(data.oldName, data.newName);
    });

    socket.on('user:join', function (data) {
      $scope.messages.push({
        user: 'chatroom',
        text: 'User ' + data.name + ' has joined.'
      });
      $scope.users.push(data.name);
    });

    // add a message to the conversation when a user disconnects or leaves the room
    socket.on('user:left', function (data) {
      $scope.messages.push({
        user: 'chatroom',
        text: 'User ' + data.name + ' has left.'
      });
      var i, user;
      for (i = 0; i < $scope.users.length; i++) {
        user = $scope.users[i];
        if (user === data.name) {
          $scope.users.splice(i, 1);
          break;
        }
      }
    });

    // Private helpers
    // ===============

    var changeName = function (oldName, newName) {
      // rename user in list of users
      var i;
      for (i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i] === oldName) {
          $scope.users[i] = newName;
        }
      }

      $scope.messages.push({
        user: 'chatroom',
        text: 'User ' + oldName + ' is now known as ' + newName + '.'
      });
    }

    // Methods published to the scope
    // ==============================

    $scope.changeName = function () {
      socket.emit('change:name', {
        name: $scope.newName
      }, function (result) {
        if (!result) {
          alert('There was an error changing your name');
        } else {

          changeName($scope.name, $scope.newName);

          $scope.name = $scope.newName;
          $scope.newName = '';
        }
      });
    };

    $scope.sendMessage = function () {
      socket.emit('send:message', {
        message: $scope.message
      });

      // add the message to our model locally
      $scope.messages.push({
        user: $scope.name,
        text: $scope.message
      });

      // clear message box
      $scope.message = '';
    };
  })
  // controller('AppCtrl', function ($scope, socket) {
  //   socket.on('send:name', function (data) {
  //     $scope.name = data.name;
  //   });
  // }).
  // controller('MyCtrl1', function ($scope, socket) {
  //   socket.on('send:time', function (data) {
  //     $scope.time = data.time;
  //   });
  // }).
  // controller('MyCtrl2', function ($scope) {
  //   // write Ctrl here
  // });