angular.module('myApp.controllers')
  .controller('TimerCtrl', function ($scope, TimerService, $timeout, $http) {
    $scope.timer = {
      tags: [
        { name: 'front end'
        , value: 'front end'
        }
      ]
    }
    $scope.projects =
    [ 'Creo'
    , 'Ingredo'
    , 'Woven'

    //   {value: '123', name: 'Creo'}
    // , {value: '12345', name: 'Ingredo'}
    // , {value: '3454', name: 'Woven'}
    ]

    $scope.tags = ['front end', 'backend', 'bugs']

    $scope.tags = [
      {value: 'front end', name: 'front end'}
    , {value: 'back end', name: 'back end'}
    , {value: 'bugs', name: 'bugs'}
    , {value: 'phase 2', name: 'phase 2'}
    ]

    $scope.timers = TimerService.get({},function (res) {
      console.log('GET', res)
      res.filter(function(timer){
        console.log(timer.active)
      })
    })

    $scope.timePretty = timePretty


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
        $scope.timers.push(res)
      })
    }

    $scope.stopTimer = function (data) {
      data.active = false
      console.log(data)

      $http.put('/api/timer/' + data._id, data).
        success(function(data, status, headers, config) {
          console.log('success', data)
          $scope.currentTimer = undefined
          $scope.timers.push(data)
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






function hrsToMillSec(hrs){
  return hrs * 60 * 60 * 1000
}

function minsToMillSec(mins){
  return mins * 60 * 1000
}

function timePretty(dateObject){
  var milliseconds = dateObject;

  // TIP: to find current time in milliseconds, use:
  // var milliseconds_now = new Date().getTime();

  var seconds = milliseconds / 1000;
  // var numyears = Math.floor(seconds / 31536000);
  // if(numyears){
  //     return numyears + 'year' + ((numyears > 1) ? 's' : '');
  // }
  // var numdays = Math.floor((seconds % 31536000) / 86400);
  // if(numdays){
  //     return numdays + 'day' + ((numdays > 1) ? 's' : '');
  // }
  var numhours = Math.floor(((seconds % 31536000)) / 3600)
  ,   numMins = Math.round(((((seconds % 31536000)) / 3600) - numhours) * 60);
  // console.log( (((seconds % 31536000) % 86400) / 3600) - numhours) * 60;
  if(numhours){
      var hours = numhours + 'hr' + ((numhours > 1) ? 's' : '')
      ,   mins = numMins + 'min' + ((numMins > 1) ? 's' : '');

      return hours + ' ' + ((numMins > 1) ? mins : '');
  }
  var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  if(numminutes){
      return numminutes + 'min' + ((numminutes > 1) ? 's' : '');
  }
  var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
  if(numseconds){
      return numseconds.toFixed() + 'sec' + ((numseconds > 1) ? 's' : '');
  }
  return '0sec'; //'just now' //or other string you like;
}