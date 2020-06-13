
function login(){

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    
    // if(username == "MedvitaTest" && password == "medvita123")
    // location.href = "Vitals.html";
    // else{
    //     alert("Incorrect Login Details")
    // }

    var auth = firebase.auth();
        auth.signInWithEmailAndPassword(username, password).catch(function(error) {
          alert('Incorrect email or password');
          return;
        });
        
        auth.onAuthStateChanged(function(user) {
          if (user) {
            window.location = "Vitals.html";
          }


    });

}