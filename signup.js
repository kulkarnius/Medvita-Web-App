/**
 * Signs up the user
 * Checks that the user properly filled out all of the entries,
 * then creates an auth account and adds the user info to the database
 * TODO: 1) Check that the email is valid
 *       2) Verify complexity of the password
 *       3) Be sure that the TOS checkbox is clicked
 */
function signup()
{  
  // Gets user info
  let Email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let vpassword = document.getElementById('vpassword').value;
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
  if (Email == '' || password == '' || vpassword == '' || Fname == '' || Lname == '' || Month == ''
  || Day == '' || Year == '' || Address == '' || City == ''|| Province == '' || Postalcode == '' ) {
    document.getElementById('password').value = "";
    document.getElementById('vpassword').value = "";
    return;
  }

  // Incorrect password
  if (password != vpassword) {
    document.getElementById('password').value = "";
    document.getElementById('vpassword').value = "";
    alert("Passwords don't match");
    return;
  }

  console.log(Email);
  console.log(password);

  // Signs up the user
  firebase.auth().createUserWithEmailAndPassword(Email, password)
  .then(function(result) {

    let userid = result.user.uid;
    console.log(userid);

    // Stores rest of data to database
    let data ={
      info: {
        fname: Fname,
        lname: Lname,
        email: Email,
        //healthcareid: healthcareId,
        uid: userid
      },
      birthday: {
        month: Month,
        day: Day,
        year: Year
      },
      location: {
        address: Address,
        city: City,
        province: Province,
        postalcode: Postalcode
        //licence: licenseArray
      },
      patients: new Array(),
      availability: new Array()
    };

    const db = firebase.firestore();

    const uinfo_ref = db.collection('doctors').doc(`${userid}`).set(data)
    .then(function() {
      // Got to homescreen
      console.log(data);
      window.location = "homescreen.html";
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


// var userid = '';

// firebase.auth().onAuthStateChanged((user) => {
//   userid = user.uid;
// })

// const db = firebase.firestore()

// db.collection('doctors').doc(`${userid}`)
// .get()
// .then((doc) => {
//   const month = doc.data().birthday.month;
// })

// db.collection('doctors').doc(`${userid}`)
// .update({
//   birthday.day = '23',
//   info.fname = 'Lucas'
// })
