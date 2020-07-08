/**
 * Time Picker
 */

const db = firebase.firestore();
const auth = firebase.auth();

const NUM_TIMES = 672;
var calendarTimeArray = new Array(NUM_TIMES);
var firstTime = '';

var selectedTimeArray = new Array();

const btnColor = '#c6d9e4cc';
const btnSelectColor = '#2853c8';

var doctorUid = '';

document.querySelector('#previousWeekBtn').addEventListener('click', previousWeek);
document.querySelector('#nextWeekBtn').addEventListener('click', nextWeek);

// Initializes patient (and possibly doctor) and creates the calendar
function init() {

  // Sets up the calendar
  const today = new Date();
  var thisYear = today.getFullYear();
  var thisMonth = today.getMonth()+1;
  var thisDay = today.getDate();
  const dayOfWeek = today.getDay();
  
  // Finds the date of this week's Sunday
  thisDay -= dayOfWeek;
  if (thisDay <= 0) {
    thisMonth--;

    // Previous year
    if (thisMonth <= 0) {
      thisMonth = 12
      thisYear--;
    }

    // Finds the date
    else if (thisMonth == 2 && thisYear%4 != 0)
      thisDay += 28;
    if (thisMonth == 2) // Leap year
      thisDay += 29;
    else if (thisMonth <= 7 && thisMonth%2 == 0
          || thisMonth >= 8 && thisMonth%2 == 1)
      thisDay += 30
    else
      thisDay += 31
  }

  const yearStr = thisYear.toString();
  var monthStr = thisMonth.toString();
  if (monthStr.length == 1){
    monthStr = '0' + monthStr;
  }
  var dayStr = thisDay.toString();
  if (dayStr.length == 1) {
    dayStr = '0' + dayStr;
  }

  firstTime = yearStr + monthStr + dayStr + '0000';

  db.collection('doctors').doc(`${doctorUid}`)
  .get()
  .then(function(doc) {
    doc.data().availability.forEach(function(dateTransfer) {
      selectedTimeArray.push(dateTransfer);
    });
  });
 
  loadCalendar();
  drawCalendar();
}

// Find the previous time box
function getPreviousTime(time) {
  var year = parseInt(time.substring(0, 4));
  var month = parseInt(time.substring(4, 6));
  var day = parseInt(time.substring(6, 8));
  var hour = parseInt(time.substring(8, 10));
  var minute = parseInt(time.substring(10, 12));

  minute -= 15

  // Previous hour
  if (minute < 0) {
    hour--;
    minute = 45;

    // Previous day
    if (hour < 0) {
      day--;
      hour = 23;

      // Previous month
      if (day < 1) {
        month--;

        // Previous year
        if (month < 1) {
          month = 12
          year--;
        }

        // Find last day of month
        if (month == 1 || month == 3 || month == 5 || month == 7
          || month == 8 || month == 10 || month == 12)
            day = 31;
          else if (month == 4 || month == 6 || month == 9 || month == 11)
            day = 30;
          else if (month == 2 && year%4 == 0)
            day = 29;
          else
            day = 28;
      }
    }
  }

  var yearStr = year.toString();

  var monthStr = month.toString();
  if (monthStr.length == 1)
    monthStr = '0' + monthStr;

  var dayStr = day.toString();
  if (dayStr.length == 1)
    dayStr = '0' + dayStr;

  var hourStr = hour.toString();
  if (hourStr.length == 1)
    hourStr = '0' + hourStr;

  var minuteStr = minute.toString();
  if (minuteStr.length == 1)
    minuteStr = '0' + minuteStr;

  return yearStr + monthStr + dayStr + hourStr + minuteStr;  
}

// Find the next time box
function getNextTime(time) {
  var year = parseInt(time.substring(0, 4));
  var month = parseInt(time.substring(4, 6));
  var day = parseInt(time.substring(6, 8));
  var hour = parseInt(time.substring(8, 10));
  var minute = parseInt(time.substring(10, 12));

  minute += 15;

  // End of hour
  if (minute >= 60) {
    minute = 0;
    hour++;

    // End of day
    if (hour >= 24) {
      hour = 0;
      day++;

      // End of month
      if (day > 31
      || (day > 30 && month <= 6 && month%2 == 0)
      || (day > 30 && month >= 9 && month%2 == 1)
      || (day > 29 && month == 2 && year%4 == 0)
      || (day > 28 && month == 2 && year%4 != 0)) {
        day = 1;
        month++;

        // End of year
        if (month > 12) {
          month = 1;
          year++;
        }
      }
    }
  }

  var yearStr = year.toString();

  var monthStr = month.toString();
  if (monthStr.length == 1)
    monthStr = '0' + monthStr;

  var dayStr = day.toString();
  if (dayStr.length == 1)
    dayStr = '0' + dayStr;

  var hourStr = hour.toString();
  if (hourStr.length == 1)
    hourStr = '0' + hourStr;

  var minuteStr = minute.toString();
  if (minuteStr.length == 1)
    minuteStr = '0' + minuteStr;

  return yearStr + monthStr + dayStr + hourStr + minuteStr;
}

// Load up all time slots in an array
function loadCalendar() {
  var currentTime = firstTime; 
  var i;
  for(i=0; i<NUM_TIMES; i++){
    calendarTimeArray[i] = currentTime;
    currentTime = getNextTime(currentTime);
  }
}

// Draws the calendar on the screen
function drawCalendar() {
  
  $('.CalShow').html('');

  // Date header
  var htmlStr = '<div class="grid-container">';
  htmlStr += '<div class="grid-item">';
  htmlStr += calendarTimeArray[0].substring(0, 4);
  htmlStr += '</div>';
  var dateStr = '';
  var i;
  for (i=0; i<7; i++) {
    dateStr = calendarTimeArray[i*96].substring(4, 6) + '/' + calendarTimeArray[i*96].substring(6, 8);
    htmlStr += '<div class="grid-item">';
    htmlStr += dateStr;
    htmlStr += '</div>';
  }

  // Go through days and create buttons for each timeslot
  var c;
  for (c=0; c<NUM_TIMES/7; c++) {
    // Create label
    const dateConcat = calendarTimeArray[c];
    var label = dateConcat.substring(8, 10) + ':' + dateConcat.substring(10, 12);
    htmlStr += '<div class="grid-item">';
    htmlStr += label;
    htmlStr += '</div>';

    // Fill in rows
    var r;
    for (r=0; r<7; r++) {
      htmlStr += '<button class="calendar-btn" id="calendarBtn';
      htmlStr += (r*96 + c).toString();
      htmlStr += '" onclick="pickTime(';
      htmlStr += (r*96 + c).toString();
      htmlStr += ')"></button>';
    }
  }
  htmlStr += '</div>';
  $('.CalShow').append(htmlStr);

  // Fills in previously selected times
  db.collection('doctors').doc(doctorUid)
  .get()
  .then(function(doc) {
    const availabilityArray = doc.data().availability;
    availabilityArray.forEach(function(dateConcat) {
      if (calendarTimeArray.includes(dateConcat)) {
        const b = calendarTimeArray.indexOf(dateConcat);
        document.getElementById(`${'calendarBtn'+b.toString()}`).style.background = btnSelectColor;
      }
    });
  });
}

// Displays the previous week's calendar
function previousWeek() {
  var year = parseInt(firstTime.substring(0, 4));
  var month = parseInt(firstTime.substring(4, 6));
  var day = parseInt(firstTime.substring(6, 8));

  day -= 7;

  // Previous month
  if (day <= 0) {

    month--;

    // Previous year
    if (month < 1) {
      month = 12;
      year--;
    }

    if (month == 1 || month == 3 || month == 5 || month == 7
      || month == 8 || month == 10 || month == 12)
        day += 31;
      else if (month == 4 || month == 6 || month == 9 || month == 11)
        day += 30;
      else if (month == 2 && year%4 == 0)
        day += 29;
      else
        day += 28;
  }

  const yearStr = year.toString();
  var monthStr = month.toString();
  if (monthStr.length == 1)
    monthStr = '0' + monthStr;
  var dayStr = day.toString();
  if (dayStr.length == 1)
    dayStr = '0' + dayStr;
  
  firstTime = yearStr + monthStr + dayStr + '0000';

  loadCalendar();
  drawCalendar();
}

// Displays the next week's calendar
function nextWeek() {
  var year = parseInt(firstTime.substring(0, 4));
  var month = parseInt(firstTime.substring(4, 6));
  var day = parseInt(firstTime.substring(6, 8));

  day += 7;

  // End of month
  if (day > 31
  || (day > 30 && month <= 6 && month%2 == 0)
  || (day > 30 && month >= 9 && month%2 == 1)
  || (day > 29 && month == 2 && year%4 == 0)
  || (day > 28 && month == 2 && year%4 != 0)) {
    
    if (month == 1 || month == 3 || month == 5 || month == 7
    || month == 8 || month == 10 || month == 12)
      day -= 31;
    else if (month == 4 || month == 6 || month == 9 || month == 11)
      day -= 30;
    else if (month == 2 && year%4 == 0)
      day -= 29;
    else
      day -= 28;

    month++;
    
    // End of year
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  const yearStr = year.toString();
  var monthStr = month.toString();
  if (monthStr.length == 1)
    monthStr = '0' + monthStr;
  var dayStr = day.toString();
  if (dayStr.length == 1)
    dayStr = '0' + dayStr;
  
  firstTime = yearStr + monthStr + dayStr + '0000';

  loadCalendar();
  drawCalendar();
}

// When the user selects one of the time boxes
function pickTime(btnNum) {

  // Get time info
  const dateConcat = calendarTimeArray[btnNum];
  const previousTime = getPreviousTime(dateConcat);
  const previousTime2 = getPreviousTime(previousTime);
  const nextTime = getNextTime(dateConcat);
  const nextTime2 = getNextTime(nextTime);

  // Button has been selected already
  if (selectedTimeArray.length > 0 && selectedTimeArray.includes(dateConcat)) {
    
    // Destroy timeblock
    selectedTimeArray.splice(selectedTimeArray.indexOf(dateConcat), 1);
    document.getElementById(`${'calendarBtn'+btnNum.toString()}`).style.background = btnColor;

    // Removes next part of timeblock
    if (selectedTimeArray.includes(nextTime) && !selectedTimeArray.includes(nextTime2)) {
      selectedTimeArray.splice(selectedTimeArray.indexOf(nextTime), 1);
      if (btnNum+1 < NUM_TIMES)
        document.getElementById(`${'calendarBtn'+(btnNum+1).toString()}`).style.background = btnColor;
    }

    // Removes previous part of timeblock
    if (selectedTimeArray.includes(previousTime) && !selectedTimeArray.includes(previousTime2)) {
      selectedTimeArray.splice(selectedTimeArray.indexOf(previousTime), 1);
      if (btnNum-1 > 0)
        document.getElementById(`${'calendarBtn'+(btnNum-1).toString()}`).style.background = btnColor;
    }

  // Button hasn't been selected
  } else {

    // Add timeblock
    selectedTimeArray.push(dateConcat);
    document.getElementById(`${'calendarBtn'+btnNum.toString()}`).style.background = btnSelectColor;
    
    // Create new timeblock
    if (!selectedTimeArray.includes(previousTime) && !selectedTimeArray.includes(nextTime)) {
        selectedTimeArray.push(nextTime);
        if (btnNum+1 < NUM_TIMES)
          document.getElementById(`${'calendarBtn'+(btnNum+1).toString()}`).style.background = btnSelectColor;
    } 
  }

  // Update database
  db.collection('doctors').doc(`${doctorUid}`)
  .update({
    availability: selectedTimeArray
  });
}

// Gets doctor uid
auth.onAuthStateChanged(function(user) {
  doctorUid = user.uid;
  init();
});
