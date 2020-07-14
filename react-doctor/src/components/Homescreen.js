// Create Firebase objects
const db = firebase.firestore();
const auth = firebase.auth();

// Stores UID of the patients listed in schedule
var scheduleUid = new Array(5);
var mtgDates = new Array(5);
var doctor = '';
var docUid = '';
var count = 0;

/**
 * Verifies that the patient exists and then creates a
 * meeting in the schedules of both the patient and
 * the doctor
 * TODO: Make sure that the meeting is during the future,
 *       that there are no conflicting meeting times,
 *       and give email verification of meeting
 */
function addApp(){
  // Get data from page
  var FName = document.getElementById('FName').value;
  var LName = document.getElementById('LName').value;
  var patient = FName + ' ' + LName;
  var Month = document.getElementById('Month').value;
  var Day = document.getElementById('Day').value;
  var Year = document.getElementById('Year').value;
  var Time = document.getElementById('Time').value;
  var Email = document.getElementById('Email').value;
  var DateConcat = Year + Month + Day + Time.replace(':','');

  // Checks that the user is valid and grabs their UID
  var patientUid = '';
  var namesMatch = true;
  var patientsRef = db.collection("patients");
  patientsRef.where("email", "==", Email)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // Checks that first name and last name match
      let data = doc.data();
      if (data.fname == FName && data.lname == LName) {
        patientUid = data.uid;
        console.log(patientUid);
      } else {
        namesMatch = false;
        alert ('No patient found');
        console.log('Names do not match');
      }
      console.log(doc.id, " => ", data);
    });

    if (namesMatch == false)
      return;

    let docRef = db.collection('doctors').doc(`${docUid}`);
    let setDoctor = docRef.get()
    .then(function(docData) {
      console.log('Doc data: ', docData.data());
      doctor = docData.data().fname + ' ' + docData.data().lname;
      console.log('Doctor: ', doctor);

      let data = {          // Arrange data
        patient: patient,
        doctor: doctor,
        month: Month,
        day: Day,
        year: Year,
        time: Time,
        //email: Email,
        dateConcat: DateConcat,
        patientuid: patientUid,
        doctoruid: docUid,
        notes: '',
        webrtckey: '',
        temperature: 29,
        tempdata: 98
      };
      console.log('Meeting data: ', data);

      // Put meeting in doctor's database
      db.collection('doctors').doc(`${docUid}`)
      .collection('schedule').doc(`${DateConcat}`)
      .set(data)
      .then(function() {
        console.log("Document written to doctor's schedule with ID: ", DateConcat);
      }).catch(function(error) {
        console.error("Error adding document: ", error);
      });

      // Put meeting in patient's database
      db.collection('patients').doc(`${patientUid}`)
      .collection('schedule').doc(`${DateConcat}`)
      .set(data)
      .then(function() {
        console.log("Document written to patient's schedule with ID: ", DateConcat);
      }).catch(function(error) {
        console.error("Error adding document: ", error);
      });
    });
  }).catch(function(error) {
    alert('No patient found');
    console.log("Error getting documents: ", error);
  });
}

/**
 * Displays each meeting on the homepage
 */
function displayApp(doc){
  $('.AppShow').append(doc.data().patient).
  append("&nbsp;").
  append("<button class='btn btn-outline-light' onClick='joinMeeting(" + count + ")'>Begin Appointment</button>").
  append('&nbsp;').
  append(doc.data().month).
  append("/").
  append(doc.data().day).
  append("&nbsp;@&nbsp;").
  append(doc.data().time).
  append("<br>").
  append("<br>");
}

/**
 * Puts the correct data in local storage and transfers the doctor
 * to the video conderence page.
 */
function joinMeeting(num) {
  localStorage.setItem("patientUid", scheduleUid[num]);
  localStorage.setItem("dateConcat", mtgDates[num]);
  window.location = "videoCall.html";
}

/**
 * Goes in the doctor's database and grabs the five soonest
 * meetings, tracks some of the data from those meetings,
 * and displays them to the page.
 * TODO: Get the 5 soonest meetings after the current time
 */
function getSchedule() {
  $('.AppShow').html("");     // Clears out previously-displayed meetings
  count = 0;
  db.collection('doctors').doc(`${docUid}`).collection('schedule')
  .orderBy('dateConcat').limit(5).get()   // Get the 5 soonest meetings
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {      // Go through each doc and display data
      console.log("Data from meeting ", count, ": ", doc.data());
      displayApp(doc);
      scheduleUid[count] = doc.data().patientuid;
      mtgDates[count] = doc.data().dateConcat;
      count++;
    });
  })
  .catch(function(error){
    console.log('Error: ', error);
  });
}

/**
 * Initializes the first (up to) five soonest
 * appointments and creates a listener that will
 * update the page if any schedule changes are
 * detected
 */
auth.onAuthStateChanged(function(user){
  if(user) {
    docUid = user.uid;
    console.log('Doctors Uid: ', docUid);
    db.collection('doctors').doc(`${user.uid}`).collection('schedule')
    .onSnapshot(function(querySnapshot) {
      getSchedule();
    });
  }
});
