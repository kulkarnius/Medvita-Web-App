function userSignUp() {
    // Retrieve email and password
    var Email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (Email == '' || password == '') {
      alert('Please fill in all entries');
      return;
    }

    console.log(Email);
    console.log(password);

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
        email: Email,
        uid: userId,
        webrtckey: null
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