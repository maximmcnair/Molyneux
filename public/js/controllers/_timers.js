angular.module('myApp.controllers')
  .controller('TimersCtrl', function ($scope, $rootScope, TimerService, ProjectService, $timeout, $http) {

    $scope.filter = 'today'
    $scope.totalItems = 0
    $scope.currentPage = 1
    $scope.pageSize = 1
    $scope.query = {}

    $scope.getToday = function () {
      var beginning = getTodayMorning(new Date())
        , now = new Date()

      // console.log(beginning, now)
      $scope.query = {
        start: beginning
      , end: now
      }
      getTimers()
      $scope.filter = 'today'
    }
    $scope.getThisWeek = function () {
      var beginning = getMonday(new Date())
        , now = new Date()

      console.log(beginning, now)
      $scope.query = {
        start: beginning
      , end: now
      }
      getTimers()
      $scope.filter = 'this week'
    }

    $scope.getToday()

    $scope.paginationViewable = false

    function isPaginationViewable() {
      $scope.paginationViewable = $scope.totalItems > $scope.pageSize
    }

    function getTimers() {
      var params = {
        pageSize: $scope.pageSize
      , page: $scope.currentPage
      }
      for (var attrname in $scope.query) {
        params[attrname] = $scope.query[attrname]
      }
      console.log(params)
      $http.get('/api/timer', {params: params}).success(function(res){
        console.log('GET timers', res)
        $scope.totalItems = res.totalItems
        $scope.currentPage = res.page
        $scope.timers = res.results
        isPaginationViewable()

        // Find active timer
        res.results.filter(function(timer){
          if(timer.active){
            console.log('active: ', timer)
            $rootScope.$broadcast('CurrentTimerChange', timer)
          }
        })
      })
    }

    $scope.$watch('currentPage', function() {
      console.log('current page update')
      getTimers()
    })

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
        isPaginationViewable()
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

    $scope.getProjectTitle = function (id) {
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if($scope.projects[i]._id === id){
          return $scope.projects[i].title
        }
      }
    }

  })