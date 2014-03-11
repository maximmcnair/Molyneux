angular.module('myApp.controllers')
  .controller('ReportsCtrl', function ($scope, $rootScope, TimerService, ProjectService, $timeout, $http) {

    // $scope.filter = 'today'
    // $scope.totalItems = 0
    // $scope.currentPage = 1
    // $scope.pageSize = 15
    //========================================================
    //  Search
    //========================================================
    $scope.query = {
      projects: []
    }

    function getTimers() {
      var params = {
        pageSize: $scope.pageSize
      , page: $scope.currentPage
      }
      for (var attrname in $scope.query) {
        params[attrname] = $scope.query[attrname]
      }
      console.log('Query:', $scope.query, params)
      $http.get('/api/timer', {params: params}).success(function(res){
        console.log('GET timers', res)
        // $scope.totalItems = res.totalItems
        // $scope.currentPage = res.page
        $scope.results = res.results
        // isPaginationViewable()
      })
    }

    $scope.search = function () {
      getTimers()
    }

    //========================================================
    //  Project
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
    $scope.formatLabel = function (model) {
      for (var i = 0; i < $scope.projects.length; i++) {
        if ($scope.projects[i] && model === $scope.projects[i]._id){
          return $scope.projects[i].title
        }
      }
    }

    //========================================================
    //  Tags
    //========================================================
    $scope.tags = []
    $http.get('/api/tags').success(function(data){
      console.log('tags GET success', data)
      $scope.tags = data
    })

    // $scope.projectsOptions = {
    //   initSelection: function (element, callback) {
    //     callback({results: []})
    //   }
    // , query: function (options) {
    //     var data = {results: []}
    //     angular.forEach($scope.projects, function(item, key){
    //       if (options.term.toUpperCase() === item.title.substring(0, options.term.length).toUpperCase()) {
    //         data.results.push({
    //           id: item._id
    //         , text: item.title
    //         })
    //       }
    //     })
    //     options.callback(data)
    //   }
    // , formatSelection: function(project) { 
    //     return project.title
    //   }
    // }

    // var availableProjects = [
    //   {text: 'Woven', id: 11234},
    //   {text: 'Ingredo', id: 26543546}
    // ];
    // $scope.projectsOptions = {
    //   tags: availableProjects,
    //   multiple: true,
    //   formatResult: function (item) {
    //     return item.text
    //   },
    //   formatSelection: function (item) {
    //     return item.text
    //   }
    // }

    $scope.tagsOptions = {
      'multiple': true,
      'simple_tags': true,
      'tags': function () {
                return $scope.tags
              }
    }


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
    $scope.timePretty = timePretty
    $scope.datePretty = datePretty

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