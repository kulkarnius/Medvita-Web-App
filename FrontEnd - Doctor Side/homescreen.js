function addApp(){
var FName = document.getElementById('FName').value;
var LName = document.getElementById('LName').value;
var Month = document.getElementById('Month').value;
var Day = document.getElementById('Day').value;
var Year = document.getElementById('Year').value;
var Time = document.getElementById('Time').value;
var Email = document.getElementById('Email').value;
console.log(FName);
console.log(LName);
console.log(Month);
console.log(Day);
console.log(Year);
console.log(Time);
console.log(Email);

db.collection("Appointments").add({
    FirstName: FName,
    LastName: LName,
    Month: Month,
    Day: Day,
    Year: Year,
    Time: Time,
    Email: Email
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
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