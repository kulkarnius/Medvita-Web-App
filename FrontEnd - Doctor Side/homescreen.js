const db = firebase.firestore();
const auth = firebase.auth();

function addApp(){
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
            dateConcat: DateConcat
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

function getSchedule() {
    auth.onAuthStateChanged(function(user){
        if(user) {
            const uid = user.uid;
            console.log('hello');
            let schedRef = db.collection('doctors').doc(`${uid}`).collection('schedule');
            schedRef.orderBy('dateConcat').limit(5).get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    const data = doc.data();
                    console.log(data);
                    // Output to HTML page
                    console.log(data.email);
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