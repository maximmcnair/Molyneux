angular.module('myApp.controllers')
  .controller('NavCtrl', function ($rootScope, $scope, $location, $routeParams) {
    $scope.path = undefined

    $rootScope.$on('$routeChangeSuccess', function () {
      $scope.path = $location.path()
    })

  })