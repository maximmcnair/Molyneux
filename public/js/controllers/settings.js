angular.module('myApp.controllers')
  .controller('SettingsCtrl', function ($scope, $http) {
      $scope.user = {}

      $http({method: 'GET', url: '/api/user'})
        .success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $scope.user = data
        })
        .error(function(data, status, headers, config) {
          console.log('error getting project:', data)
        })
  })