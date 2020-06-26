//TODO: make something like 't for temp, b for blink'
//and make sure it actually works
//kinda like one of those loops in the c++ books
//forever lookin for input if you will (calling itself at the end)

// requires
const SerialPort = require('serialport')
const prompt = require('prompt');
//activating port (currently hardcoded to COM3)
try {
  const port = new SerialPort('COM3', { baudRate: 4800 })
} catch (err) {
  //console.log('Unable to open connection to device!')
  throw "Unable to connect to device!"
}


//firebase activation
const admin = require('firebase-admin');
//so i am a dumbass
//and idk how to make the thing work referring to a json file like everything else
//so i did it this very jank way
let serviceAccount = require('C:/Users/athul/Documents/medtech/Firestorekey.json'); //pls make not jank


// Janky sleep function lol (TODO: make unjank)
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// Temp conversion - ported from usb.py 
/*
Written by: Ryan Mah
Note: assumes Vcc = Vref = 5V
*/
function V(ADC) {
  //Calculates the voltage as a function of ADC value"""
  return ADC / 204.8
}

function R(V) {
  //Calculates the resistance as a function of V"""
  return (10000 * V) / (5 - V)
}

function T(R) {
  //Calculates the temperature as a function of R (IN CELSIUS)"""
  Ro = 10000
  B = 3988 //NEEDS TO BE CHANGED
  r_inf = 0
  T_K = 0
  T_C = 0
  r_inf = Ro * Math.exp((-1 * B) / 298.15)

  T_K = B / (Math.log(R / r_inf))
  T_C = T_K - 273.15 //Convert to celsius

  return T_C
}

function T_from_ADC(ADC) {
  //Calculates the tempature (in celsius) as a function of ADC value"""
  return T(R(V(ADC)))
}

//Binary to Dec converter
function bin_to_dec(binary_str) {
  placeholder = binary_str.split('')
  output = 0
  i = 0
  while (placeholder.length > 0) {
    output += placeholder[placeholder.length - 1] * (2 ** i)
    i++
    placeholder.pop()
  }
  return output
}

//writes char to port
function write_to_port(input_char) {
  port.write(input_char, function (err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    //console.log('message written')
    return true
  })
}

// this actually doesnt work lol
//the issue is that it reads twice
//and return doesnt like that
//so it returns undefined
//which is a problem
function read_from_port() {
  total_text = '0'
  //used for collecting output
  out_array = [];
  return_array = [];
  // reading from port
  port.on('readable', function () {
    sleep(400) //optimize this - prevents reading buffer prematurely (very jank though)
    out_array.push((port.read().toString()));
    //console.log(out_array)
    total_text = out_array.join('')
    //console.log(total_text)
    total_text = total_text.replace(/Selected1\n/, '')
    return_array.push(total_text)
    console.log(total_text)
    sleep(400)

  })
  sleep(10)
  console.log(total_text)
  console.log(return_array)
  //console.log(T_from_ADC(bin_to_dec(return_array[return_array.length - 1])))
}

write_to_port('1')


//firebase crap
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

patientid = 'Bkd9DGFVsPcfraPEmRJoFOxRlLZ2' //pls unhardcode
apptdate = '202001010730' //unhardcode this pls
let docRef = db.collection('patients').doc(`${patientid}`)
  .collection('schedule').doc(`${apptdate}`); //patient id and scheudle are hardcoded because i suck

function write_to_firestore(temp_data) {
  let settemp = docRef.set({
    temperature: `${temp_data}`
  }, { merge: true });
}

//extra variables for port reading
out_array = [];
total_text = ''
// reading from port 
//pls ignore all the console.logs - they're here for debugging
port.on('readable', function () {
  sleep(400) //optimize this - prevents reading buffer prematurely (very jank though)
  out_array.push((port.read().toString()));
  //console.log(out_array)
  total_text = out_array.join('')
  //console.log(total_text)
  total_text = total_text.replace(/Selected1\n/, '')
  //console.log(total_text)
  //console.log(T_from_ADC(bin_to_dec(total_text)))

  potato = 0 //potato is converted to an str and then written to firebase
  potato = T_from_ADC(bin_to_dec(total_text))
  //console.log(potato.toString())
  write_to_firestore(potato.toString())
})

// dunno what this is but it seems important for the port
function onErr(err) {
  console.log(err);
  return 1;
}

// Exits program after some amout of milliseconds
setTimeout((function () {
  return process.exit(22);
}), 5000);