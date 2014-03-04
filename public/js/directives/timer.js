angular.module('myApp')
  .directive('timer', function (TimerService, ProjectService, $rootScope, $http) {
    return {
      restrict: 'E'
    , scope: true
    , controller: function ($scope, $element) {
        $scope.timePretty = timePretty

        //========================================================
        //  Editable func
        //========================================================
        $scope.editable = false
        $scope.tags = []
        $scope.projects = []
        $scope.formatLabel = function (model) {
          for (var i = 0; i < $scope.projects.length; i++) {
            if ($scope.projects[i] && model === $scope.projects[i]._id){
              return $scope.projects[i].title
            }
          }
        }
        $scope.edit = function () {
          $scope.editable = true
          $http.get('/api/tags').success(function(data){
            console.log('tags GET success', data)
            $scope.tags = data
          })
          $scope.projects = ProjectService.get({}, function (res) {
            console.log(res)
          })
        }
        $scope.save = function () {
          $http.put('/api/timer/' + $scope.timer._id, $scope.timer).
            success(function(data, status, headers, config) {
              console.log('success', data)
              $rootScope.$broadcast('TimerEdited', data)
              $scope.editable = false
            }).
            error(function(data, status, headers, config) {
              console.log('error', data)
            })
        }
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