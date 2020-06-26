/**
 * Creates a listener that will detect any changes to the
 * WebRTC key in the specific meeting, an then transfer
 * the patient to the video call
 */
const db = firebase.firestore();
const auth = firebase.auth();
auth.onAuthStateChanged(function(user) {
  if (user) {
    const dateConcat = localStorage.getItem('dateConcat');
    console.log('Patient Uid: ', user.id);
    console.log('Date concatenation: ', dateConcat);
    db.collection('patients').doc(`${user.id}`)
    .collection('schedule').doc(`${dateConcat}`)
    .onSnapshot(function(querySnapshot) {
      console.log(querySnapshot.data().webrtckey)
      if (querySnapshot.data().webrtckey != '') {
        console.log('Sending patient to video call');
        window.location = 'videoCall.html';
      }
    });
  }
});
