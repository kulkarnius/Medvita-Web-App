/*
  Signs up the user, stores all of their entered data into database
  Note: currently only creates an Firebase auth account, Jacob is 
  working on implementing the backend that stores into database
*/

function signup()
{  
  // Gets user info
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let vpassword = document.getElementById('vpassword').value;

  // Incorrect password
  if (password != vpassword) {
    document.getElementById('password').value = "";
    document.getElementById('vpassword').value = "";
    alert("Passwords don't match");
    return;
  }

  console.log(email);
  console.log(password);

  // Signs up the user
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(result) {

    let userid = result.user.uid;
    console.log(userid);

    // Gather data
    let Fname = document.getElementById('fname').value;
    let Lname = document.getElementById('lname').value;
    let Month = document.getElementById('month').value;
    let Day = document.getElementById('day').value;
    let Year = document.getElementById('year').value;
    let Address = document.getElementById('address').value;
    let City = document.getElementById('city').value;
    let Province = document.getElementById('province').value;
    let Postalcode = document.getElementById('pcode').value;

    // Checks that entries were filled
    if (Fname == '') return;
    if (Lname == '') return;
    if (Month == '') return;
    if (Day == '') return;
    if (Year == '') return;
    if (Address == '') return;
    if (City == '') return;
    if (Province == '') return;
    if (Postalcode == '') return;

    // Stores rest of data to database
    let data ={
      uid: userid,
      fname: Fname,
      lname: Lname,
      birthday: {
        month: Month,
        day: Day,
        year: Year
      },
      address: Address,
      city: City,
      province: Province,
      postalcode: Postalcode
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
