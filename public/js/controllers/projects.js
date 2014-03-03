angular.module('myApp.controllers')
  .controller('ProjectsCtrl', function ($scope, ProjectService) {
    // console.log('projects')
    $scope.projects = ProjectService.get({}, function (res) {
      console.log(res)
    })
  })