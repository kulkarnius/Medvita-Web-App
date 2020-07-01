// Initialize GCP instances
const db = firebase.firestore();
const auth = firebase.auth();

/**
 * Gathers the data to access correct patient and doctor database,
 * create a listener that detects and updates sensor measurements
 */
var doctorUid = '';
var patientUid = localStorage.getItem('patientUid');
var dateConcat = localStorage.getItem('dateConcat');
auth.onAuthStateChanged(function(user) {
  // Log meeting data
  doctorUid = user.uid;
  console.log('Doctor Uid: ', doctorUid);
  console.log('Patient Uid: ', patientUid);
  console.log('Date Concatenation: ', dateConcat);

  // Listens and displays patient's data
  var TempList = document.querySelector('.TempShow');
  var TempList2 = document.querySelector('.TempShow2');
  function displayTemp(doc) {
    $('.TempShow').html('').append(doc.data().temperature);
    $('.TempShow2').html('').append(doc.data().tempdata);
  }

  // Adds listener to patient database
  db.collection('patients').doc(`${patientUid}`)
  .collection('schedule').doc(`${dateConcat}`)
  .onSnapshot(function(doc) {       

    // Displays sensor data
    console.log("Patient schedule data: ", doc.data());
    displayTemp(doc);

    // Copies sensot data to doctor's database
    db.collection('doctors').doc(`${doctorUid}`)
    .collection('schedule').doc(`${dateConcat}`)
    .set(doc.data());
  });
});

// Video services
mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));

const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomDialog = null;
let roomId = null;
let patientId = null;

/**
 * Initializes all of the event listeners
 */
function init() {
  document.querySelector('#cameraBtn').addEventListener('click', openUserMedia);
  document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  document.querySelector('#createBtn').addEventListener('click', createRoom);
  document.querySelector('#joinBtn').addEventListener('click', joinRoom);
  roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));
}

/**
 * Saves the notes that the doctor takes and puts them in the cloud
 */
function saveFormData() {
  var notes = document.getElementById('notes').value;
  console.log("Doctor's notes: ", notes);
  
  // Puts notes in doctor's database
  db.collection('doctors').doc(`${doctorUid}`)
  .collection('schedule').doc(`${dateConcat}`)
  .update({
    notes: notes
  });

  // Puts notes in patient's database
  db.collection('patients').doc(`${patientUid}`)
  .collection('schedule').doc(`${dateConcat}`)
  .update({
    notes: notes
  });
}

/**
 * Create a room and put the WebRTC key into the patient's 
 * and the doctor's database
 */
async function createRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;
  const roomRef = await db.collection('rooms').doc();

  console.log('Create PeerConnection with configuration: ', configuration);
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Code for collecting ICE candidates below
  const callerCandidatesCollection = roomRef.collection('callerCandidates');

  peerConnection.addEventListener('icecandidate', event => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    console.log('Got candidate: ', event.candidate);
    callerCandidatesCollection.add(event.candidate.toJSON());
  });
  // Code for collecting ICE candidates above

  // Code for creating a room below
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log('Created offer:', offer);

  const roomWithOffer = {
    'offer': {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  await roomRef.set(roomWithOffer);
  roomId = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);

  // Update WebRTC key for patient
  db.collection('patients').doc(`${patientUid}`)
  .collection('schedule').doc(`${dateConcat}`)
  .update({
    webrtckey: roomId
  });

  // Update WebRTC key for doctor
  db.collection('doctors').doc(`${doctorUid}`)
  .collection('schedule').doc(`${dateConcat}`)
  .update({
    webrtckey: roomId
  });

  peerConnection.addEventListener('track', event => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach(track => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      console.log('Got remote description: ', data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });
  // Listening for remote session description above

  // Listen for remote ICE candidates below
  roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  // Listen for remote ICE candidates above
}

// Is not needed on doctor's side, eventually will be deleted (deleting now will cause errors)
function joinRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;

  document.querySelector('#confirmJoinBtn').
      addEventListener('click', async () => {
        roomId = document.querySelector('#room-id').value;
        console.log('Join room: ', roomId);
        document.querySelector(
            '#currentRoom').innerText = `Current room is ${roomId} - You are the callee!`;
        await joinRoomById(roomId);
      }, {once: true});
  roomDialog.open();
}

// Is not needed on doctor's side, eventually will be deleted (deleting now will cause errors)
async function joinRoomById(roomId) {
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();
  console.log('Got room:', roomSnapshot.exists);

  if (roomSnapshot.exists) {
    console.log('Create PeerConnection with configuration: ', configuration);
    peerConnection = new RTCPeerConnection(configuration);
    registerPeerConnectionListeners();
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      calleeCandidatesCollection.add(event.candidate.toJSON());
    });
    // Code for collecting ICE candidates above

    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });

    // Code for creating SDP answer below
    const offer = roomSnapshot.data().offer;
    console.log('Got offer:', offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    console.log('Created answer:', answer);
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await roomRef.update(roomWithAnswer);
    // Code for creating SDP answer above

    // Listening for remote ICE candidates below
    roomRef.collection('callerCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listening for remote ICE candidates above
  }
}

/**
 * Turns on the doctor's webcam and microphone
 */
async function openUserMedia(e) {
  const stream = await navigator.mediaDevices.getUserMedia(
      {video: true, audio: true});
  document.querySelector('#localVideo').srcObject = stream;
  localStream = stream;
  remoteStream = new MediaStream();
  document.querySelector('#remoteVideo').srcObject = remoteStream;

  console.log('Stream:', document.querySelector('#localVideo').srcObject);
  document.querySelector('#cameraBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = false;
  document.querySelector('#createBtn').disabled = false;
  document.querySelector('#hangupBtn').disabled = false;
}

/**
 * Hangs up the call and clears WebRTC key 
 */
async function hangUp(e) {
  const tracks = document.querySelector('#localVideo').srcObject.getTracks();
  tracks.forEach(track => {
    track.stop();
  });

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  document.querySelector('#localVideo').srcObject = null;
  document.querySelector('#remoteVideo').srcObject = null;
  document.querySelector('#cameraBtn').disabled = false;
  document.querySelector('#joinBtn').disabled = true;
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#hangupBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = '';

  // Remove key WebRTC key from patient database
  db.collection('patients').doc(`${patientUid}`)
  .collection('schedule').doc(`${dateConcat}`)
  .update({
    webrtckey: ''
  });

  // Remove key WebRTC key from doctor database
  db.collection('doctors').doc(`${doctorUid}`)
  .collection('schedule').doc(`${dateConcat}`)
  .update({
    webrtckey: ''
  });

  // Stores doctor's notes in the schedule


  // Delete room on hangup
  if (roomId) {
    const roomRef = db.collection('rooms').doc(roomId);
    const calleeCandidates = await roomRef.collection('calleeCandidates').get();
    calleeCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    const callerCandidates = await roomRef.collection('callerCandidates').get();
    callerCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    await roomRef.delete();
  }

  document.location.reload(true);
}

/**
 * Registers the peer conection
 */
function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`);
  });
}

init();
