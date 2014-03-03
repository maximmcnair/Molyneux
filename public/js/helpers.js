
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

function getMonday(d) {
  d = new Date(d)
  var day = d.getDay()
    , diff = d.getDate() - day + (day == 0 ? -6:1) // adjust when day is sunday
    , monday = new Date(d.setDate(diff))
    , mondayMorning = new Date(monday.setHours(0))
    , mondayMorning = new Date(mondayMorning.setMinutes(0))
    , mondayMorning = new Date(mondayMorning.setSeconds(0))
  return mondayMorning
}

function getTodayMorning(d) {
  var today = new Date(d)
    , todayMorning = new Date(today.setHours(0))
    , todayMorning = new Date(todayMorning.setMinutes(0))
    , todayMorning = new Date(todayMorning.setSeconds(0))

  return todayMorning
}

// function getTitle(id, array){
//   for (var i = array.length - 1; i >= 0; i--) {
//     if(array[i]._id === id){
//       return array[i].title
//     }
//   }
// }