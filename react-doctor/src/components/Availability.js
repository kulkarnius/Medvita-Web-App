import React from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "../styles/availability.css";

class Availability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }



  render() {
    return(
      <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark"
          // style ="background: linear-gradient(to left, #12c2e9, #c471ed, #f64f59); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */"
        />
          <a className="navbar-brand" href="#">Medvita - MD</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0"> 
              <li className="nav-item active">
                <a className="nav-link" href="homescreen.html">Dashboard</a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="availability.html">Availability</a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="videoCall.html">
                  Console
                  <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="#">Patient Profiles</a>
              </li>
            </ul>
            <form className="form-inline my-2 my-lg-0">
              <a className="btn btn-outline-light" href="login.html" role="button">Logout</a>
            </form>
          </div>
        </nav>
      </div>
      <div className="container">
        <div className="display-4 text-center py-5">
          Please block off which times you are available
        </div>
        <div className="mb-5 ml-5 mr-5 text-center">
          <button className=" btn btn-outline-light" id="previousWeekBtn">Previous Week</button>
          <button className="btn btn-outline-light"id="nextWeekBtn">Next Week</button>
        </div>
        <div className="CalShow"/>
      </div>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
        crossorigin="anonymous"/>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
        crossorigin="anonymous"/>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
        integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
        crossorigin="anonymous"/>
      </>
    );
  }
}

export default Availability;




class Calendar extends React.Component {
  
}




const db = firebase.firestore();
const auth = firebase.auth();

const NUM_TIMES = 672;
var calendarTimeArray = new Array(NUM_TIMES);
var firstTime = '';

var selectedTimeArray = new Array();

const btnColor = '#ffffff00';
const btnSelectColor = '#23F36B';

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
/*
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
    }*/

  // Button hasn't been selected
  } else {

    // Add timeblock
    selectedTimeArray.push(dateConcat);
    document.getElementById(`${'calendarBtn'+btnNum.toString()}`).style.background = btnSelectColor;
    /*
    // Create new timeblock
    if (!selectedTimeArray.includes(previousTime) && !selectedTimeArray.includes(nextTime)) {
        selectedTimeArray.push(nextTime);
        if (btnNum+1 < NUM_TIMES)
          document.getElementById(`${'calendarBtn'+(btnNum+1).toString()}`).style.background = btnSelectColor;
    } */
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
