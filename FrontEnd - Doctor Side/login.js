/*
  Login Function
  Currently only includes login via email, while
  HTML says either email or username acceptable
*/

function login(){
  // Gets user info
  var email = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  console.log(email);
  console.log(password);

  // Logs in user
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(result) {
    // Redirects to Vitals page
    window.location = "Vitals.html";
  }).catch(function(error) {
    // Error handling
    alert('Incorrect email or password');
  });
}
