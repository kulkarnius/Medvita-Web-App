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

    var userid = result.user.uid;
    console.log(userid);

    // Stores rest of data to database
    let data ={
      uid: userid,
      fname: document.getElementById('fname').value,
      lname: document.getElementById('lname').value,
      birthday: {
        month: document.getElementById('month').value,
        day: document.getElementById('day').value,
        year: document.getElementById('year').value
      },
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      province: document.getElementById('province').value,
      postalcode: document.getElementById('pcode').value
    };

    const db = firebase.firestore();

    const uinfo_ref = db.collection('doctors').doc(`${userid}`).set(data)
    .then(function() {
      // Got to vitals page
      console.log(data);
      window.location = "Vitals.html";
    }).catch(function(error) {
      // Couldn't put data in database
      alert('Could not put data in database');
      console.log('Error: ', error);
    }); 

  }).catch(function(error) {
    // Error handling
    console.log('Error: ', error);
    alert('Could not create an account');
  });
}
