const db = firebase.firestore();
const auth = firebase.auth();

auth.onAuthStateChanged(function(user) {
  if (user) {
    const patientUid = user.uid;
    console.log('Patient Uid: ', patientUid);
    db.collection('patients').doc(`${patientUid}`)
    .onSnapshot(function(querySnapshot) {
      console.log(querySnapshot.data().webrtckey)
      if (querySnapshot.data().webrtckey != '') {
        localStorage.setItem('webrtckey', querySnapshot.data().webrtckey);
        window.location = 'videoCall.html';
      }
    });
  }
});