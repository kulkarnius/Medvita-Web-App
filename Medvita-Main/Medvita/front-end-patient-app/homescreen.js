// Create Firebase objects
const db = firebase.firestore();
const auth = firebase.auth();

// Stores UID of the patients listed in schedule
var scheduleUid = new Array(5);
var patient = '';
var patientUid = '';

// Add an appointment
function addApp(){
  // Get data from page
  var FName = document.getElementById('FName').value;
  var LName = document.getElementById('LName').value;
  var doctor = FName + ' ' + LName;
  var Month = document.getElementById('Month').value;
  var Day = document.getElementById('Day').value;
  var Year = document.getElementById('Year').value;
  var Time = document.getElementById('Time').value;
  var Email = document.getElementById('Email').value;
  var DateConcat = Year + Month + Day + Time.replace(':','');

  // Checks that the user is valid and grabs their UID
  var doctorUid = '';
  var doctorRef = db.collection("doctors");
  doctorRef.where("email", "==", Email)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // Checks that first name and last name match
      let data = doc.data();
      if (data.fname == FName && data.lname == LName) {
        doctorUid = data.uid;
        console.log(doctorUid);
      } else {
        alert ('No matching doctor found');
        console.log('Names do not match');
      }
      console.log(doc.id, " => ", data);
    });

    // Sends data to database
    auth.onAuthStateChanged(function(user){
      console.log('user: ', user, ' doctor id: ', doctorUid);
      if(user && doctorUid != '') {
        // Put meeting in doctor database
        const patientUid = user.uid;
        let patientRef = db.collection('patients').doc(`${patientUid}`);
        let getPatient = patientRef.get()
        .then(function(doc) {
          patient = doc.data().fname + ' ' + doc.data().lname;
          console.log(doc.id, '=>', doc.data());

        
        console.log('Patient name: ', patient);

        let data = {
          patient: patient,
          doctor: doctor,
          month: Month,
          day: Day,
          year: Year,
          time: Time,
          //email: Email,
          dateConcat: DateConcat,
          patientuid: patientUid,
          doctoruid: doctorUid,
          temperature: 29,
          tempdata: 98
        };
        console.log(data);

        let docSchedRef = db.collection('doctors').doc(`${doctorUid}`)
        .collection('schedule').doc(`${DateConcat}`);
        const setDocSched = docSchedRef.set(data)
        .then(function() {
          console.log("Document written with ID: ", DateConcat);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
  
        // Put meeting in patient database
        let patSchedRef = db.collection('patients').doc(`${patientUid}`)
        .collection('schedule').doc(`${DateConcat}`);
        const setPatSched = patSchedRef.set(data)
        .then(function() {
          console.log("Document written with ID: ", DateConcat);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
        });
      } else {
        console.log('No user found');
      }
    })
  })
  .catch(function(error) {
    alert('No matching doctor found');
    console.log("Error getting documents: ", error);
  });
}

function attemptJoinMeeting() {
  console.log('Joining meeting...');
  // Check for WebRTCkey
  db.collection('patients').doc(`${patientUid}`)
  .get()
  .then(function(doc) {
    console.log("Patient's user data: ", doc.data());
    if (doc.data().webrtckey != '') {
      // Doctor has created session
      localStorage.setItem("webrtckey", doc.data().webrtckey);
      window.location = "videoCall.html";
    } else {
      // Key does not exist
      window.location = "waitingRoom.html";
    }
  });
}

function displayApp(doc){
  $('.AppShow').append(doc.data().doctor).
  append("&nbsp;").
  append("<button class='btn btn-outline-light' onClick='attemptJoinMeeting()'>Begin Appointment</button>").
  append('&nbsp;').
  append(doc.data().month).
  append("/").
  append(doc.data().day).
  append("&nbsp;@&nbsp;").
  append(doc.data().time).
  append("<br>").
  append("<br>");
}

// Displays the 5 newest doctor's appointments for the patients
function getSchedule() {
  console.log('Retrieving schedule');
  $('.AppShow').html("");
  count = 0;

  // Detects Firebase Auth user
  auth.onAuthStateChanged(function(user){
    if(user) {
      patientUid = user.uid;
      console.log('Patient uid: ', patientUid);
      // Get the schedule for the current user
      db.collection('patients').doc(`${patientUid}`).collection('schedule')
      .orderBy('dateConcat').limit(5).get()
      .then(function(querySnapshot) {
        console.log('Displaying each meeting');
        console.log(querySnapshot);
        querySnapshot.forEach(function(doc) {
          console.log(doc.data());
          displayApp(doc);
        });
      })
      .catch(function(error){
        console.log('Error: ', error);
      });
    } else {
      console.log('No user detected');
    }
  });
}

getSchedule();

auth.onAuthStateChanged(function(user){
  if(user) {
    db.collection('patients').doc(`${user.uid}`).collection('schedule')
    .onSnapshot(function(querySnapshot) {
      getSchedule();
    });
  }
});
