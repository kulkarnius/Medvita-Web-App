// Validates the user's email
function validateEmail(email) 
{
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Temporary signup for email updates
function signup() {
  if (!document.getElementById('invalidCheck').checked) {
    alert('Please agree to the privacy policy');
    return;
  }

  const email = document.getElementById('email').value;
  if (!validateEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }

  const db = firebase.firestore();
  db.collection('emails').doc('updates')
  .update({
    email: firebase.firestore.FieldValue.arrayUnion(`${email}`)
  })
  .then(function() {
    console.log('Going to next page');
    window.location = "signupConfirmation.html";
  });
}    
