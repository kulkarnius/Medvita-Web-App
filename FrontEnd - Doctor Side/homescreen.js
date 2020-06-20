
// Create Firebase objects
const db = firebase.firestore();
const auth = firebase.auth();

// Add an appointment
function addApp(){
    // Get data from page
    var FName = document.getElementById('FName').value;
    var LName = document.getElementById('LName').value;
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
    /*  This code will eventually query through the patient
        database and find the patient with a matching email.
        It will then verify that it is the correct user by
        checking that the names match, and it will grab
        that patients uid.
    */
    // For testing purposes:
    var patientUid = 'bVdsSQj58ehpkHhk155MyJjdY1s1';
    console.log(patientUid);

    // Senda data to database
    auth.onAuthStateChanged(function(user){
        if(user) {
            const uid = user.uid;
            let schedRef = db.collection('doctors').doc(`${uid}`)
                .collection('schedule').doc(`${DateConcat}`);
            const setSched = schedRef.set({
            fName: FName,
            lName: LName,
            month: Month,
            day: Day,
            year: Year,
            time: Time,
            email: Email,
            dateConcat: DateConcat,
            uid: patientUid
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", DateConcat);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        } else {
            console.log('No user found');
        }
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




// function login()
// {  
//   // Gets user info
//   var email = document.getElementById('username').value;
//   var password = document.getElementById('password').value;
//   console.log(email);
//   console.log(password);

//   // Signs up the user
//   firebase.auth().signInWithEmailAndPassword(email, password)
//   .then(function(result) {
//     // Redirects to Vitals page
//     window.location = "Vitals.html";
//   }).catch(function(error) {
//     // Error handling
//     alert('Something went wrong');
//   });
// }