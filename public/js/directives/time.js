angular.module('myApp')
  .directive('time', function () {
    return {
      restrict: 'E'
    , scope: {
        model: '='
      }
    , templateUrl: '/partials/time'
    , controller: function ($scope, $element) {
        $scope.hour = '0'
        $scope.minutes = '00'

        $scope.model = calcTotal()
        $scope.$watch('hour', function () {
          if($scope.hour.length > 3){
            $scope.hour = $scope.hour.substring(1, 4)
          }
          $scope.model = calcTotal()
        })
        $scope.$watch('minutes', function () {
          if($scope.minutes.length > 2){
            $scope.minutes = $scope.minutes.substring(1, 3)
          }
          $scope.model = calcTotal()
        })

        function calcTotal () {
          return parseInt($scope.hour * 60 * 60 * 1000) + parseInt($scope.minutes * 60 * 1000)
        }
      }
    }
  })
  .directive('number', function () {
    return {
      restrict: 'A'
    , require: '^ngModel'
    , scope: {
        ngModel: '='
      }
    , link: function ($scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
          // console.log('event.which:', event.which)
          // Only allow numbers to be added
          if (event.which > 47 && event.which < 58){
            return event
          }
          // up key to increase
          if (event.which === 38){
            // Stop number from being above 60
            if(attrs.minute && $scope.ngModel > 59){
              return false
            }
            $scope.$apply(function(){
              $scope.ngModel++
              // Add zero to front of number if below 10
              if(attrs.minute && $scope.ngModel < 10){
                $scope.ngModel = '0' + $scope.ngModel
              }
            })
          }
          // down key to decrease
          if (event.which === 40){
            if($scope.ngModel > 0){
              $scope.$apply(function(){
                $scope.ngModel--
                // Add zero to front of number if below 10
                if(attrs.minute && $scope.ngModel < 10){
                  $scope.ngModel = '0' + $scope.ngModel
                }
              })
            }
          }
          // return keys
          if(
            event.which === 9 || // tab
            event.which === 8 || // backspace
            event.which === 37 || // left
            event.which === 39 // right
            ){
            return
          }
          return false
        })
      }
    }
  })