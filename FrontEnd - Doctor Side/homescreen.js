// Create Firebase objects
const db = firebase.firestore();
const auth = firebase.auth();

// Stores UID of the patients listed in schedule
var scheduleUid = new Array(5);
var doctor = '';

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
        alert ('No patient found');
        console.log('Names do not match');
      }
      console.log(doc.id, " => ", data);
    });

    // Sends data to database
    auth.onAuthStateChanged(function(user){
      if(user && patientUid != '') {
        // Put meeting in doctor database
        const doctorUid = user.uid;
        let docRef = db.collection('doctors').doc(`${doctorUid}`);
        let setDoctor = docRef.get()
        .then(function(doc) {
          doctor = doc.data().fname + ' ' + doc.data().lname;
          console.log(doc.id, '=>', doc.data());
          console.log(doctor);
        })
        .then(function() {

        
        console.log('Doctor: ', doctor);

        let data = {
          patient: patient,
          doctor: doctor,
          month: Month,
          day: Day,
          year: Year,
          time: Time,
          email: Email,
          dateConcat: DateConcat,
          patientuid: patientUid,
          doctoruid: doctorUid
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
  var AppList = document.querySelector('.AppShow');
  let AppDisplay = document.createElement('AppShow');
  let App = document.createElement('span');
  AppDisplay.setAttribute('data-id', doc.id);
  App.textContent = doc.data().lName; 
  console.log(doc.data().lName);
  AppDisplay.appendChild(App);
  AppList.appendChild(AppDisplay);
  AppDisplay.replaceChild(App,App);
  console.log(doc.id);
}





// Displays the 5 newest doctor appointments
function getSchedule() {
  auth.onAuthStateChanged(function(user){
    if(user) {
      const docUid = user.uid;
      let count = 0;
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
          scheduleUid[count] = data.uid;
          console.log('Patients UID: ' + data.uid);
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
