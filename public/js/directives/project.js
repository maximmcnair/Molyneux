angular.module('myApp')
  .directive('project', function (ProjectService, $rootScope, $http) {
    return {
      restrict: 'E'
    , scope: true
    , controller: function ($scope, $element) {
        $scope.timePretty = timePretty

        $scope.editable = false
        $scope.edit = function () {
          $scope.editable = true
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
          $http.delete('/api/project/' + $scope.project._id).
            success(function(data, status, headers, config) {
              console.log('success', data)
              $rootScope.$broadcast('ProjectRemoved', $scope.project)
            }).
            error(function(data, status, headers, config) {
              console.log('error', data)
            })
        }
      }
    }
  })