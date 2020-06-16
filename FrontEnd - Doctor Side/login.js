
function login()
{  
  // Gets user info
  var email = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  console.log(email);
  console.log(password);

  // Signs up the user
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(result) {
    // Redirects to Vitals page
    window.location = "Vitals.html";
  }).catch(function(error) {
    // Error handling
    alert('Something went wrong');
  });
}