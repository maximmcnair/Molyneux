'use strict';

/* Directives */

angular.module('myApp.directives', [])
  .directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version)
    }
  })
  .directive('timer', function (TimerService, $rootScope) {
    return {
      restrict: 'E'
    , scope: true
    , controller: function ($scope, $element) {
        $scope.editable = false
        $scope.delete = function (data) {
          TimerService.delete({}, {'Id': data._id}).$promise.then(
            function( success ){
              for (var i = 0; i < $scope.$parent.timers.length; i++){
                if ($scope.$parent.timers[i]._id && $scope.$parent.timers[i]._id == data._id){
                  console.log($scope.$parent.timers[i]._id)
                  $scope.$parent.timers.splice(i, 1)
                  break
                }
              }
            },
            function( error ){
              console.log('error', error);
            }
          )
        }
        $scope.edit = function () {
          $scope.editable = !$scope.editable
        }
      }
    }
  })