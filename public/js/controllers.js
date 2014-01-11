// 'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ProjectCtrl', function ($scope, $http, $routeParams) {
    $scope.project = {}
    $http({method: 'GET', url: '/api/projects/' + $routeParams.projectId})
      .success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.project = data
      })
      .error(function(data, status, headers, config) {
        console.log('error getting project:', data)
      })
  })
  .controller('ProjectsCtrl', function ($scope, socket, $http, $timeout, $upload) {
    $scope.name = []
    $scope.team = []
    $scope.users = []
    $scope.projects = []
    $scope.project = []

    //========================================================
    //  File Upload
    //========================================================
    $scope.upload = []
    $scope.uploadRightAway = true;
    $scope.hasUploader = function (index) {
      return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
      $scope.upload[index].abort();
      $scope.upload[index] = null;
    };
    $scope.onFileSelect = function ($files) {
      $scope.selectedFiles = [];
      $scope.progress = [];
      if ($scope.upload && $scope.upload.length > 0) {
        for (var i = 0; i < $scope.upload.length; i++) {
          if ($scope.upload[i] != null) {
            $scope.upload[i].abort();
          }
        }
      }
      $scope.upload = [];
      $scope.uploadResult = [];
      $scope.selectedFiles = $files;
      $scope.dataUrls = [];
      for (var i = 0; i < $files.length; i++) {
        var $file = $files[i];
        if (window.FileReader && $file.type.indexOf('image') > -1) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL($files[i]);
          function setPreview(fileReader, index) {
            fileReader.onload = function (e) {
              $timeout(function () {
                $scope.dataUrls[index] = e.target.result;
              });
            }
          }

          setPreview(fileReader, i);
        }
        $scope.progress[i] = -1;
        if ($scope.uploadRightAway) {
          $scope.start(i);
        }
      }
    }

    $scope.start = function (index) {
      $scope.progress[index] = 0;
      console.log('starting...');
      console.log($scope.myModel);
      console.log($scope.selectedFiles[index]);
      $scope.upload[index] = $upload.upload({
        url: '/api/file/upload',
        headers: {'myHeaderKey': 'myHeaderVal'},
        // data: {
        //   title: $scope.title
        // , author: $scope.author
        // , description: $scope.description
        // },
        file: $scope.selectedFiles[index],
        fileFormDataName: 'myFile'
      }).then(function (response) {
        console.log('response', response)
        $scope.project.thumbnail = response.data.path
        $scope.uploadResult.push(response.data.result);
      }, null, function (evt) {
        $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
      });
    }


    //========================================================
    //  Socket Setup
    //========================================================
    socket.on('init', function (data) {
      $scope.name = data.name
      $scope.team = data.team
      $scope.users = data.users
      $scope.projects = data.projects
    })

    //========================================================
    //  Socket - Users
    //========================================================
    socket.on('user:join', function (data) {
      $scope.users.push(data.name)
    })

    // add a message to the conversation when a user disconnects or leaves the room
    socket.on('user:left', function (data) {
      var i, user
      for (i = 0; i < $scope.users.length; i++) {
        user = $scope.users[i]
        if (user === data.name) {
          $scope.users.splice(i, 1)
          break
        }
      }
    })

    //========================================================
    //  Socket - Projects
    //========================================================
    // Add project
    socket.on('project:add', function (project) {
      $scope.projects.push(project)
    })

    $scope.addProject = function () {
      socket.emit('project:add', {
        title: $scope.project.title
      , description: $scope.project.description
      , thumbnail: $scope.project.thumbnail
      })

      // add the projects to our model locally
      $scope.projects.push($scope.project)

      // clear projects box
      $scope.project = ''
    }


    // Remove project when someone else deletes it
    socket.on('project:remove', function (projectTitle) {
      var i
      for (i = 0; i < $scope.projects.length; i++) {
        var project = $scope.projects[i]
        if (project.title === projectTitle) {
          $scope.projects.splice(i, 1)
          break
        }
      }
    })

    $scope.removeProject = function (projectTitle) {
      var i
      for (i = 0; i < $scope.projects.length; i++) {
        var project = $scope.projects[i]
        if (project.title === projectTitle) {
          $scope.projects.splice(i, 1)
          break
        }
      }

      socket.emit('project:remove', projectTitle)
    }
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
  .controller('LoginCtrl', function ($scope, $location) {
    $('.js-login-bob').on('click', function () {
      $.ajax({
        url: '/login'
      , type: 'post'
      , data: {
          'username' : 'bob'
        , 'email' : 'bob@synthmedia.co.uk'
        , 'password' : 'cheese cake'
        }
      , success: function (res) {
          console.log(res)
          $scope.$apply(function () {
            $location.path('/')
          });
        }
      })
    })

    $('.js-login-mark').on('click', function () {
      $.ajax({
        url: '/login'
      , type: 'post'
      , data: {
          'username' : 'mark'
        , 'email' : 'mark@synthmedia.co.uk'
        , 'password' : 'cheese cake'
        }
      , success: function (res) {
          console.log(res)
          $scope.$apply(function () {
            $location.path('/')
          });
        }
      })
    })

    $('.js-login-steve').on('click', function () {
      $.ajax({
        url: '/login'
      , type: 'post'
      , data: {
          'username' : 'steve'
        , 'email' : 'steve@synthmedia.co.uk'
        , 'password' : 'cheese cake'
        }
      , success: function (res) {
          console.log(res)
          $scope.$apply(function () {
            $location.path('/')
          });
        }
      })
    })
  });