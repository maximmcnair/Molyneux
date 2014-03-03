angular.module('myApp.controllers')
  .controller('TimersCtrl', function ($scope, $rootScope, TimerService, ProjectService, $timeout, $http) {
    $scope.timers = TimerService.get({},function (res) {
      res.filter(function(timer){
        if(timer.active){
          console.log('active: ', timer)
          $rootScope.$broadcast('CurrentTimerChange', timer)
        }
      })
    })
    $scope.projects = ProjectService.get({}, function (res) {
      console.log(res)
    })
    $scope.getProjectTitle = function (id) {
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if($scope.projects[i]._id === id){
          return $scope.projects[i].title
        }
      }
    }


    // Add timer to scope on broadcast
    $scope.$on('TimersAdd', function(event, timer) {
      $scope.timers.push(timer)
    })
    $scope.getToday = function () {
      $scope.timers = TimerService.get({},function (res) {
        console.log('getToday', res)
      })
    }
    $scope.getThisWeek = function () {
      $scope.timers = TimerService.get({},function (res) {
        console.log('getThisWeek', res)
      })
    }
    $scope.getThisMonth = function () {
      $scope.timers = TimerService.get({},function (res) {
        console.log('getThisMonth', res)
      })
    }
  })