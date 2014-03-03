angular.module('myApp.controllers')
  .controller('ProjectsCtrl', function ($scope, $rootScope, ProjectService) {
    // console.log('projects')
    $scope.projects = ProjectService.get({}, function (res) {
      console.log(res)
    })

    $scope.createProject = function () {
      console.log('create project')
      var newProject = new ProjectService($scope.project)
      newProject.$save({}, function (res) {
        console.log('success', res)
        $scope.projects.push(res)
        $rootScope.$broadcast('ProjectAdded', res)
        $scope.project = ''
      })
    }
  })