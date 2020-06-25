// Logs in the patient
function login()
{  
  const db = firebase.firestore();
  const auth = direbase.auth();

  // Gets user info
  var email = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  console.log(email);
  console.log(password);

  // Signs in the doctor
  auth.signInWithEmailAndPassword(email, password)
  .then(function(user) {
    // // Ensures that email is for doctor and not patient
    console.log(user.uid);
    db.collection('patients').doc(`${user.uid}`)
    .get()
    .then(function(doc) {
      // Redirects to homescreen
      console.log('Logged in ', doc.data().fname, ' ', doc.data().lname);
      //window.location = "homescreen.html";
    })
    .catch(function(error) {
      console.log('User is not a patient');
      auth.signOut();
      alert('Account does not exits');
    }); 
  }).catch(function(error) {
    // Error handling
    console.log('Cannot sign in through Firebase Auth');
    alert('Account does not exist');
  });
}
