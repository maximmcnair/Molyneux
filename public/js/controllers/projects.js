angular.module('myApp.controllers')
  .controller('ProjectsCtrl', function ($scope, $rootScope, ProjectService) {
    // console.log('projects')
    $scope.projects = ProjectService.get({}, function (res) {
      console.log(res)
    })

    $scope.createProject = function (project) {
      // console.log('create project', project)
      var newProject = new ProjectService(project)
      newProject.$save({}, function (res) {
        console.log('success', res)
        $scope.projects.push(res)
        $rootScope.$broadcast('ProjectAdded', res)
        $scope.project = ''
      })
    }
    $scope.$on('ProjectRemoved', function(event, project) {
      console.log('projects remove', project.title)
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if($scope.projects[i]._id === project._id){
          $scope.projects.splice(i, 1)
        }
      }
    })
  })