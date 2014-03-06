angular.module('myApp.controllers')
  .controller('TimersCtrl', function ($scope, $rootScope, TimerService, ProjectService, $timeout, $http) {
    //========================================================
    //  Get todays timers
    //========================================================
    $scope.timers = undefined

    function getTimers() {
      var params = {
        pageSize: $scope.pageSize
      , page: $scope.currentPage
      , start: getTodayMorning(new Date())
      , end: new Date()
      }
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


    //========================================================
    //  Pagination
    //========================================================
    $scope.totalItems = 0
    $scope.currentPage = 1
    $scope.pageSize = 5
    $scope.paginationViewable = false
    function isPaginationViewable() {
      $scope.paginationViewable = $scope.totalItems > $scope.pageSize
    }
    $scope.$watch('currentPage', function() {
      console.log('current page update')
      getTimers()
    })

    //========================================================
    //  Helpers
    //========================================================
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
  })