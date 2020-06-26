/**
 * Logs in the user
 * Checks that the user logs into the auth account, and
 * then makes sure that the account is registered as
 * a patient.
 * TODO: Add forgot password page
 */
function login() {
  const db = firebase.firestore();
  const auth = firebase.auth();

  // Gets user info
  var email = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  console.log(email);
  console.log(password);

  // Signs in the patient
  auth.signInWithEmailAndPassword(email, password)
    .then(function (result) {
      // Ensures that email is for doctor and not patient
      console.log(result.user.uid);
      db.collection('patients').doc(`${result.user.uid}`)
        .get()
        .then(function (doc) {
          // Redirects to homescreen
          console.log('Logged in ', doc.data().fname, ' ', doc.data().lname);
          window.location = "homescreen.html";
        })
        .catch(function (error) {
          console.log('User is not a patient');
          auth.signOut();
          window.UserPassError();
        });
    }).catch(function (error) {
      // Error handling
      console.log('Cannot sign in through Firebase Auth');
      window.UserPassError();
    });
}