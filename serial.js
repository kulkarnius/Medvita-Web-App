//TODO: make something like 't for temp, b for blink'
//and make sure it actually works
//kinda like one of those loops in the c++ books
//forever lookin for input if you will (calling itself at the end)

// requires
const SerialPort = require('serialport')
const prompt = require('prompt');
//activating port (currently hardcoded to COM3)
const port = new SerialPort('COM3', {baudRate: 4800})


// Janky sleep function lol (TODO: make unjank)
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

//used for collecting output
out_array = [];

//Requesting inputs from user - TODO is here
prompt.start();
prompt.get(['char_input', 'no_of_in'], function (err, result) {
    i = 0;
    while (i < result.no_of_in) {
      //writing to the port
      port.write(result.char_input, function(err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log('message written')
      })
      i++;
    }
});

// reading from port
port.on('readable', function () {
  sleep(400) //optimize this - prevents reading buffer prematurely (very jank though)
  out_array.push((port.read().toString()));
  console.log(out_array)
})

// dunno what this is but it seems important
function onErr(err) {
    console.log(err);
    return 1;
}


// Exits program after some amout of milliseconds
setTimeout((function() {
  return process.exit(22);
}), 5000);



















/*
rl.question('Input pls ', function(answer) {
  console.log(`${answer} is input`);
  /*
  port.write(`${answer}`, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written')
  }); 
  i++;
  console.log(i);
  rl.close();
});
*/


/*
// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})

port.on('data', function (data) {
  console.log('Data:', data)
})
*/