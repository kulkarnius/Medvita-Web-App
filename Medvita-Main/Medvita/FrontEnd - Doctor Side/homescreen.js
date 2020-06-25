// Create Firebase objects
const db = firebase.firestore();
const auth = firebase.auth();

// Stores UID of the patients listed in schedule
var scheduleUid = new Array(5);
var mtgDates = new Array(5);
var doctor = '';
var docUid = '';
var count = 0;

// Add an appointment
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

  console.log(FName);
  console.log(LName);
  console.log(Month);
  console.log(Day);
  console.log(Year);
  console.log(Time);
  console.log(Email);
  console.log(DateConcat);

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

    // Sends data to database
    auth.onAuthStateChanged(function(user){
      if(user && patientUid != '') {
        // Put meeting in doctor database
        const doctorUid = user.uid;
        let docRef = db.collection('doctors').doc(`${doctorUid}`);
        let setDoctor = docRef.get()
        .then(function(docData) {
          console.log('Doc data: ', docData);
          doctor = docData.data().fname + ' ' + docData.data().lname;
          console.log(docData.id, '=>', docData.data());
          console.log(doctor);
        
        console.log('Doctor: ', doctor);

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

        let docSchedRef = docRef.collection('schedule').doc(`${DateConcat}`);
  
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
    alert('No patient found');
    console.log("Error getting documents: ", error);
  });
}




//var AppList = document.querySelector('.AppShow');

function displayApp(doc){
  // var AppList = document.querySelector('.AppShow');
  // let AppDisplay = document.createElement('AppShow');
  // let App = document.createElement('span');
  // AppDisplay.setAttribute('data-id', doc.id);
  // App.textContent = doc.data().patient +"<br>"; 
  // console.log(doc.data().patient);
  // AppDisplay.appendChild(App);
  // AppList.appendChild(AppDisplay);
  // AppDisplay.replaceChild(App,App);
  console.log(doc.id);
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

function joinMeeting(num) {
  localStorage.setItem("patientId", scheduleUid[num]);
  localStorage.setItem("dateConcat", mtgDates[num]);
  window.location = "videoCall.html";
}

// Displays the 5 newest doctor appointments
function getSchedule() {
  $('.AppShow').html("");
  count = 0;

  auth.onAuthStateChanged(function(user){
    if(user) {
      docUid = user.uid;
      let schedRef = db.collection('doctors').doc(`${docUid}`).collection('schedule');
      schedRef.orderBy('dateConcat').limit(5).get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const data = doc.data();
          console.log(data);
          // Output to HTML page (Lucas DOM manipulation goes here)

          // The patient uid, which is the variable that needs to be stored
          // in localStorage variable 'patientId' when the video button
          // is clicked, will be stored in data.uid. I'm not sure how you
          // will store the uid for each of the 5 patients, but you may not need
          // to. If you only have a 'start meeting' button for the
          // nearest meeting, you might be able to get away with
          // preemptively putting the variable in local storage
          // during the first pass-through of this code

          displayApp(doc);
          scheduleUid[count] = data.patientuid;
          mtgDates[count] = data.dateConcat;
          console.log('Patients UID: ' + data.patientuid);
          count++;
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
    db.collection('doctors').doc(`${docUid}`).collection('schedule')
        .onSnapshot(function(querySnapshot) {
          getSchedule();
    });
  }
});
