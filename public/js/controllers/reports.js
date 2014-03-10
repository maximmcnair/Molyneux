angular.module('myApp.controllers')
  .controller('ReportsCtrl', function ($scope, $rootScope, TimerService, ProjectService, $timeout, $http) {

    // $scope.filter = 'today'
    // $scope.totalItems = 0
    // $scope.currentPage = 1
    // $scope.pageSize = 15
    $scope.query = {}

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
        // $scope.totalItems = res.totalItems
        // $scope.currentPage = res.page
        $scope.results = res.results
        // isPaginationViewable()
      })
    }

    $scope.search = function () {
      console.log($scope.query)
    }


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
    $scope.timePretty = timePretty
    $scope.datePretty = datePretty


    // $scope.$watch('currentPage', function() {
    //   console.log('current page update')
    //   getTimers()
    // })
    // $scope.paginationViewable = false
    // function isPaginationViewable() {
    //   $scope.paginationViewable = $scope.totalItems > $scope.pageSize
    // }

    //========================================================
    // Date stuff
    //========================================================
    $scope.format = dateFormat

    $scope.setQueryToday = function () {
      $scope.query = {
        start: getTodayMorning()
      , end: new Date()
      }
    }

    $scope.setQueryWeek = function () {
      $scope.query = {
        start: getMonday()
      , end: new Date()
      }
    }

    $scope.setQueryMonth = function () {
      $scope.query = {
        start: getFirstMorningOfMonth()
      , end: new Date()
      }
    }
  })