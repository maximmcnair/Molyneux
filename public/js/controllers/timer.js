angular.module('myApp.controllers')
  .controller('TimerCtrl', function ($scope, $rootScope, TimerService, ProjectService, $timeout, $http) {
    $scope.timer = {
      tags: [
        // { name: 'front end'
        // , value: 'front end'
        // }
      ]
    // , title: 'Hello'
    }

    $scope.timePretty = timePretty

    $scope.currentTimer = undefined
    $scope.$on('CurrentTimerChange', function(event, currentTimer) {
      $scope.currentTimer = currentTimer
      increment()
    })

    // $scope.projects =
    // [ 'Creo'
    // , 'Ingredo'
    // , 'Woven'
    // ]
    $scope.projects = [{"title":"Al Pacino","description":"He's a real man.","team":"52d155ed8d94e2e235000001","thumbnail":"/uploads/52d1875ea1c2f2cfdf000004_Screen Shot 2013-12-16 at 20.54.31.png","_id":"52d1a04c0b244861e0000002","__v":0},{"title":"Treepress","description":"sadfas","team":"52d155ed8d94e2e235000001","thumbnail":"/uploads/52d1875ea1c2f2cfdf000004_tumblr_lpu3jmP5qL1qcs4zto1_1280.jpg","_id":"52d1a6d96d53e43de1000002","__v":0}] 

    // ProjectService.get({}, function (res) {
    //   console.log(JSON.stringify(res))
    //   var addresses = [];
    //   angular.forEach(res.data.results, function(item){
    //     addresses.push(item.formatted_address);
    //   });
    // })
    console.log($scope.projects)

    // $scope.tags = ['front end', 'backend', 'bugs']

    $scope.tags = [
      {value: 'front end', name: 'front end'}
    , {value: 'back end', name: 'back end'}
    , {value: 'bugs', name: 'bugs'}
    , {value: 'phase 2', name: 'phase 2'}
    ]

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