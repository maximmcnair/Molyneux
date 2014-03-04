angular.module('myApp.controllers')
  .controller('TimerCtrl', function ($scope, $rootScope, TimerService, ProjectService, $timeout, $http) {
    $scope.timer = {
      tags: [
      ]
    }

    $scope.timePretty = timePretty

    $scope.currentTimer = undefined
    $scope.$on('CurrentTimerChange', function(event, currentTimer) {
      $scope.currentTimer = currentTimer
      increment()
    })

    $scope.projects = ProjectService.get({}, function (res) {
      console.log(res)
    })
    $scope.$on('ProjectEdited', function(event, editedProject) {
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if($scope.projects[i]._id === editedProject._id){
          $scope.projects[i] = editedProject
        }
      }
      console.log($scope.projects)
    })
    $scope.$on('ProjectAdded', function(event, project) {
      $scope.projects.push(project)
    })
    $scope.$on('ProjectRemoved', function(event, project) {
      console.log('projects remove', project.title)
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if($scope.projects[i]._id === project._id){
          $scope.projects.splice(i, 1)
        }
      }
    })
    $scope.formatLabel = function (model) {
      for (var i = 0; i < $scope.projects.length; i++) {
        if ($scope.projects[i] && model === $scope.projects[i]._id){
          return $scope.projects[i].title
        }
      }
    }

    $scope.tags = []

    $http.get('/api/tags').success(function(data){
      console.log('tags GET success', data)
      $scope.tags = data
    })

    $scope.startTimer = function  (data) {
      var newTimer = new TimerService(data)
      newTimer.active = true
      newTimer.total = 0
      newTimer.$save({}, function (res) {
        console.log('success', res)
        $scope.timer = {}
        $scope.currentTimer = res
        increment()
      })
    }
    $scope.addTimer = function  (data) {
      var newTimer = new TimerService(data)
      newTimer.active = false
      var time = newTimer.time.split(':')
      newTimer.total = hrsToMillSec(time[0]) + minsToMillSec(time[1])
      newTimer.$save({}, function (res) {
        console.log('success', res)
        $scope.timer = {}
        // $scope.timers.push(res)
        $rootScope.$broadcast('TimersAdd', res)
      })
    }

    $scope.stopTimer = function (data) {
      data.active = false
      console.log(data)

      $http.put('/api/timer/' + data._id, data).
        success(function(data, status, headers, config) {
          console.log('success', data)
          $scope.currentTimer = undefined
          // $scope.timers.push(data)
          $rootScope.$broadcast('TimersAdd', data)
        }).
        error(function(data, status, headers, config) {
          console.log('error', data)
        })
    }


    // Start timer counter
    function increment(){
      console.log('increment')
      if($scope.currentTimer && $scope.currentTimer.active === true){
        // Increment time
        $scope.currentTimer.total += 1000

        // If task is still active loop increment
        $timeout(function () {
          // console.log($scope.task.time)
          increment()
        }, 1000)
      }
    }
  
    $scope.getProjectTitle = function (id) {
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if($scope.projects[i]._id === id){
          return $scope.projects[i].title
        }
      }
    }


    //========================================================
    // Date stuff
    //========================================================
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
      $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      'year-format': "'yy'",
      'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
  })