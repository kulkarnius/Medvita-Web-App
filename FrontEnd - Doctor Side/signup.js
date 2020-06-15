/*
  Signs up the user, stores all of their entered data into database
  Note: currently only creates an Firebase auth account, Jacob is 
  working on implementing the backend that stores into database
*/

function signup()
{  
  // Gets user info
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  console.log(email);
  console.log(password);

  // Signs up the user
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(result) {
    // Redirects to Vitals page
    window.location = "Vitals.html";
  }).catch(function(error) {
    // Error handling
    alert('Something went wrong');
  });
}
