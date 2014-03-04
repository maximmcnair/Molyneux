'use strict';

/* Directives */

angular.module('myApp.directives', [])
  .directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version)
    }
  })
  .directive('timer', function (TimerService, $rootScope, $http) {
    return {
      restrict: 'E'
    , scope: true
    , controller: function ($scope, $element) {
        $scope.timePretty = timePretty

        $scope.editable = false
        // $scope.edit = function () {
        //   $scope.editable = !$scope.editable
        // }
        $scope.continue = function () {
          console.log('continue', $scope.timer._id)

          $scope.timer.active = true
          $http.put('/api/timer/' + $scope.timer._id, $scope.timer).
            success(function(data, status, headers, config) {
              console.log('success', data)
              $rootScope.$broadcast('CurrentTimerChange', $scope.timer)
            }).
            error(function(data, status, headers, config) {
              console.log('error', data)
            })
        }
        $scope.remove = function () {
          console.log('remove', $scope.timer.title)
          $http.delete('/api/timer/' + $scope.timer._id).
            success(function(data, status, headers, config) {
              console.log('success', data)
              $rootScope.$broadcast('TimerRemoved', $scope.timer)
            }).
            error(function(data, status, headers, config) {
              console.log('error', data)
            })
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