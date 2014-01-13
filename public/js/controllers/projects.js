angular.module('myApp.controllers')
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
    //  Socket Projects
    //========================================================
    socket.emit('projects:get')
    socket.on('projects:get', function (data) {
      $scope.projects = data.projects
    })

    $scope.$on('$destroy', function (event) {
      socket.getSocket().removeAllListeners('project')
      // or something like
      // socket.removeListener(this);
    })

    // Add project
    socket.on('projects:add', function (project) {
      $scope.projects.push(project)
    })

    $scope.addProject = function () {
      socket.emit('projects:add', {
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
    socket.on('projects:remove', function (projectTitle) {
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

      socket.emit('projects:remove', projectTitle)
    }
  })