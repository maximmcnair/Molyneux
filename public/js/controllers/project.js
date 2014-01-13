angular.module('myApp.controllers')
  .controller('ProjectCtrl', function ($scope, socket, $http, $routeParams, TaskService) {
    $scope.user = user
    $scope.project = {}

    $http({method: 'GET', url: '/api/projects/' + $routeParams.projectId})
      .success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.project = data
      })
      .error(function(data, status, headers, config) {
        console.log('error getting project:', data)
      })

    socket.emit('tasks:join', {project: $routeParams.projectId})
    socket.on('tasks:join', function (data) {
      $scope.tasks = data.tasks
    })
    // Add task
    socket.on('tasks:add', function (task) {
      // Check if task exists in array
      addIfNotInArray($scope.tasks, task)
    })

    $scope.addTask = function () {
      // socket.emit('tasks:add', {
      //   title: $scope.task.title
      // , description: $scope.task.description
      // , project: $routeParams.projectId
      // })
      TaskService.post({
        title: $scope.task.title
      , description: $scope.task.description
      , project: $routeParams.projectId
      }, function (newTask) {
        console.log('task saved:', newTask)
        // add the tasks to our model locally
        // $scope.tasks.push(newTask.data)
        addIfNotInArray($scope.tasks, newTask.data)

        // clear tasks box
        $scope.task = ''
      })
    }
    // Remove task when someone else deletes it
    // socket.on('tasks:remove', function (taskTitle) {
    //   var i
    //   for (i = 0; i < $scope.tasks.length; i++) {
    //     var task = $scope.tasks[i]
    //     if (task.title === taskTitle) {
    //       $scope.tasks.splice(i, 1)
    //       break
    //     }
    //   }
    // })
    // $scope.removeTask = function (taskTitle) {
    //   var i
    //   for (i = 0; i < $scope.tasks.length; i++) {
    //     var task = $scope.tasks[i]
    //     if (task.title === taskTitle) {
    //       $scope.tasks.splice(i, 1)
    //       break
    //     }
    //   }

    //   socket.emit('tasks:remove', taskTitle)
    // }

    $scope.startTimer = function (task) {
      console.log('start timer for', task.title)
      $http({
        method: 'POST'
      , url: '/api/timer/start'
      , data: {
          task: task._id
        , project: task.project
        , start: new Date()
        // , stop: String
        , total: 0
        }
      // , headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
        .success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(data)
        })
        .error(function(data, status, headers, config) {
          console.log('error getting project:', data)
        })
    }
    $scope.stopTimer = function (timerId) {
      console.log('stop timer', timerId)
      $http({
        method: 'POST'
      , url: '/api/timer/' + timerId + '/stop'
      , data: {
          stop: new Date()
        }
      // , headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
        .success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(data)
        })
        .error(function(data, status, headers, config) {
          console.log('error getting project:', data)
        })
    }
  })


addIfNotInArray = function (array, object) {
  var objectExists = false
  for (var i = array.length - 1; i >= 0; i--) {
    if(array[i]._id === object._id){
      objectExists = true
    }
  }
  if(objectExists === false){
    array.push(object)
  }
}