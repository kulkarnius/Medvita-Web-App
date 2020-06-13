/*
skeleton code, eventually will add allow user to schedule an appt
*/

const admin = require('firebase-admin');  

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDx8Ix9D_ROmcJBA1HpKDiR_iJcbGMrZHI",
    authDomain: "medtech-277402.firebaseapp.com",
    databaseURL: "https://medtech-277402.firebaseio.com",
    projectId: "medtech-277402",
    storageBucket: "medtech-277402.appspot.com",
    messagingSenderId: "692417874019",
    appId: "1:692417874019:web:69b0aecaa42a54451d9056",
    measurementId: "G-LKCEYMETRK"
};

// Initialize Firebase
admin.initializeApp(firebaseConfig);
let db = admin.firestore();

// When patient schedules a meeting
function patientScheduleMeeting(PatientID, Day, Time, Length, Doctor, ApptInfo)
{
    // Add the data that patient entered into Firestore
    let data = {
        patientID: PatientID,
        date = {
            day: Day,
            time: Time,
            length: Length
        },
        doctor: Doctor,
        apptInfo: ApptInfo,
        isAccepted: false
    };
    let addAppt = db.document('patients/' + PatientID + '/schedule/' + Day + Time).set(data);

    // Code to send verification to doctor goes here
}
                            