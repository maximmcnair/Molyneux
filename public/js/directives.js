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
        $scope.timePretty = timePretty

        $scope.editable = false
        // $scope.delete = function (data) {
        //   TimerService.delete({}, {'Id': data._id}).$promise.then(
        //     function( success ){
        //       for (var i = 0; i < $scope.$parent.timers.length; i++){
        //         if ($scope.$parent.timers[i]._id && $scope.$parent.timers[i]._id == data._id){
        //           console.log($scope.$parent.timers[i]._id)
        //           $scope.$parent.timers.splice(i, 1)
        //           break
        //         }
        //       }
        //     },
        //     function( error ){
        //       console.log('error', error);
        //     }
        //   )
        // }
        // $scope.edit = function () {
        //   $scope.editable = !$scope.editable
        // }
        $scope.continue = function () {
          console.log('continue', $scope.timer._id)
        }
      }
    }
  })
  .directive('project', function (ProjectService, $rootScope, $http) {
    return {
      restrict: 'E'
    , scope: true
    , controller: function ($scope, $element) {
        $scope.timePretty = timePretty

        $scope.editable = false
        $scope.edit = function () {
          $scope.editable = !$scope.editable
        }
        $scope.save = function () {
          $http.put('/api/project/' + $scope.project._id, $scope.project).
            success(function(data, status, headers, config) {
              console.log('success', data)
              $rootScope.$broadcast('ProjectEdited', data)
              $scope.editable = false
            }).
            error(function(data, status, headers, config) {
              console.log('error', data)
            })
        }
        $scope.remove = function () {
          console.log('remove')
        }
      }
    }
  })