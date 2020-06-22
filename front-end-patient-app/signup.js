function userSignUp() {
  // Retrieve email and password
  var Email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var FName = document.getElementById('fName').value;
  var LName = document.getElementById('lName').value;

  if (Email == '' || password == '' || FName == '' || LName == '') {
    alert('Please fill in all entries');
    return;
  }

  console.log(Email);
  console.log(password);
  console.log(FName);
  console.log(LName);

  // Validate email and password
  if (Email.length < 4) {
    alert('Please enter a valid email address');
    return;
  }
  if (password.length < 8) {
    alert('Password must contain at least 8 characters');
    return;
  }

  // Logs in user
  firebase.auth().createUserWithEmailAndPassword(Email, password)
  .then(function(result) {
    let userId = result.user.uid;
    console.log(userId);

    let db = firebase.firestore();
    let docRef = db.collection('patients').doc(`${userId}`);

    let data = {
      fname: FName,
      lname: LName,
      email: Email,
      uid: userId,
      webrtckey: ''
    };

    docRef.set(data).then(function(){
      console.log(data);
      window.location = "firebase.html";
    });
  
  }).catch(function(error) {
    // Error handling
    alert('something went wrong');
  });
}
