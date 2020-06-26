// Create Firebase objects
const db = firebase.firestore();
const auth = firebase.auth();

// Stores basic user info
var doctorUidArray = new Array(5);
var dateArray = new Array(5);
var patient = '';
var patientUid = '';
var count = 0;

/**
 * Add an apointment
 * User clicks button, verifies that the doctor exists,
 * then adds that appointment in both the patient's and
 * the doctor's schedule.
 * TODO: Add an email confirmation of the appointment
 */
function addApp() {
    // Get data from page
    var FName = document.getElementById('FName').value;
    var LName = document.getElementById('LName').value;
    var doctor = FName + ' ' + LName;
    var Month = document.getElementById('Month').value;
    var Day = document.getElementById('Day').value;
    var Year = document.getElementById('Year').value;
    var Time = document.getElementById('Time').value;
    var Email = document.getElementById('Email').value;
    var DateConcat = Year + Month + Day + Time.replace(':', '');

    // Checks that the user is valid and grabs their UID
    var doctorUid = '';
    var doctorRef = db.collection("doctors");
    doctorRef.where("email", "==", Email)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // Checks that first name and last name match
                let data = doc.data();
                if (data.fname == FName && data.lname == LName) {
                    doctorUid = data.uid;
                    console.log(doctorUid);
                } else {
                    alert('No matching doctor found');
                    console.log('Names do not match');
                }
                console.log(doc.id, " => ", data);
            });

            // Sends data to database
            auth.onAuthStateChanged(function (user) {
                console.log('user: ', user, ' doctor id: ', doctorUid);
                if (user && doctorUid != '') {
                    // Put meeting in doctor database
                    const patientUid = user.uid;
                    let patientRef = db.collection('patients').doc(`${patientUid}`);
                    let getPatient = patientRef.get()
                        .then(function (doc) {
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
                                notes: '',
                                webrtckey: '',
                                temperature: 29,
                                tempdata: 98
                            };
                            console.log(data);

                            let docSchedRef = db.collection('doctors').doc(`${doctorUid}`)
                                .collection('schedule').doc(`${DateConcat}`);
                            const setDocSched = docSchedRef.set(data)
                                .then(function () {
                                    console.log("Document written with ID: ", DateConcat);
                                })
                                .catch(function (error) {
                                    console.error("Error adding document: ", error);
                                });

                            // Put meeting in patient database
                            let patSchedRef = db.collection('patients').doc(`${patientUid}`)
                                .collection('schedule').doc(`${DateConcat}`);
                            const setPatSched = patSchedRef.set(data)
                                .then(function () {
                                    console.log("Document written with ID: ", DateConcat);
                                })
                                .catch(function (error) {
                                    console.error("Error adding document: ", error);
                                });
                        });
                } else {
                    console.log('No user found');
                }
            })
        })
        .catch(function (error) {
            alert('No matching doctor found');
            console.log("Error getting documents: ", error);
        });
}

/**
 * Join the meeting
 * When the user clicks on one of the buttons
 * in the schedule, they will attempt to join
 * a video meeting with the doctor. If the doctor
 * has not initiated a meeting, then they will
 * be placed in a waiting room until the doctor
 * starts the meeting.
 */
function attemptJoinMeeting(num) {
    console.log('Joining meeting on ', dateArray[num]);
    db.collection('patients').doc(`${patientUid}`)
        .collection('schedule').doc(`${dateArray[num]}`)  // Patient's meeting data
        .get()
        .then(function (doc) {
            console.log("Patient's user data: ", doc.data());    // Save meeting date and doc uid
            localStorage.setItem("dateConcat", dateArray[num]);
            localStorage.setItem("doctorUid", doc.data().doctoruid);
            if (doc.data().webrtckey != '') {
                console.log('WebRTC key found');          // Key has been found
                window.location = "videoCall.html";
            } else {
                console.log('Going to waiting-room');     // Key has not been updated
                window.location = "waitingRoom.html";
            }
        });
}

/**
 * Displays each appointment on the screen
 * Takes in a document in the 'schedule' collection
 * of the patient and outputs its data to the screen.
 */
function displayApp(doc) {
    $('.AppShow').append(doc.data().doctor).
        append("&nbsp;").
        append("<button class='btn btn-outline-light' onClick='attemptJoinMeeting(" + count + ")'>Begin Appointment</button>").
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
 * Get's an up-to-date schedule from the database
 */
function getSchedule() {
    console.log('Retrieving schedule');
    $('.AppShow').html("");
    count = 0;

    // Detects Firebase Auth user
    auth.onAuthStateChanged(function (user) {
        if (user) {
            patientUid = user.uid;
            console.log('Patient uid: ', patientUid);
            // Get the schedule for the current user
            db.collection('patients').doc(`${patientUid}`).collection('schedule')
                .orderBy('dateConcat').limit(5).get()
                .then(function (querySnapshot) {
                    console.log('Displaying each meeting');
                    console.log(querySnapshot);

                    // Goes through the closest meetings
                    querySnapshot.forEach(function (doc) {
                        console.log("Schedule data for meeting ", count, " : ", doc.data());
                        displayApp(doc);
                        doctorUidArray[count] = doc.data().doctoruid;
                        dateArray[count] = doc.data().dateConcat;
                        count++;
                    });
                })
                .catch(function (error) {
                    console.log('Error: ', error);
                });
        } else {
            console.log('No user detected');
        }
    });
}

/**
  * Loads the schedule to the screen, and sets a listener
  * that allows for real-time of the schedule
  */
getSchedule();
auth.onAuthStateChanged(function (user) {
    if (user) {
        db.collection('patients').doc(`${user.uid}`).collection('schedule')
            .onSnapshot(function (querySnapshot) {
                getSchedule();
            });
    }
});