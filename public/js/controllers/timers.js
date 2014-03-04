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

    $scope.filter = 'today'
    $scope.projects = ProjectService.get({}, function (res) {
      console.log(res)
    })

    // Add timer to scope on broadcast
    $scope.$on('TimersAdd', function(event, timer) {
      var timerExists = false
      for (var i = $scope.timers.length - 1; i >= 0; i--) {
        if($scope.timers[i]._id === timer._id){
          timerExists = true
          $scope.timers[i] = timer
        }
      }
      if(!timerExists){
        $scope.timers.push(timer)
      }
    })
    $scope.$on('TimerRemoved', function(event, timer) {
      console.log('timers remove', timer.title)
      for (var i = $scope.timers.length - 1; i >= 0; i--) {
        if($scope.timers[i]._id === timer._id){
          $scope.timers.splice(i, 1)
        }
      }
    })
    $scope.getToday = function () {
      var beginning = getTodayMorning(new Date())
        , now = new Date()

      console.log(beginning, now)
      $scope.timers = TimerService.get({},function (res) {
        console.log('getToday', res)
        $scope.filter = 'today'
      })
    }
    $scope.getThisWeek = function () {
      var beginning = getMonday(new Date())
        , now = new Date()

      console.log(beginning, now)
      $scope.timers = TimerService.get({},function (res) {
        console.log('getThisWeek', res)
        $scope.filter = 'week'
      })
    }
    // $scope.getThisMonth = function () {
    //   $scope.timers = TimerService.get({},function (res) {
    //     console.log('getThisMonth', res)
    //     $scope.filter = 'month'
    //   })
    // }

    $scope.getProjectTitle = function (id) {
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if($scope.projects[i]._id === id){
          return $scope.projects[i].title
        }
      }
    }
  })