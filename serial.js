//TODO: make something like 't for temp, b for blink'
//and make sure it actually works
//kinda like one of those loops in the c++ books
//forever lookin for input if you will (calling itself at the end)

const SerialPort = require('serialport')
const prompt = require('prompt');
const port = new SerialPort('COM3', {baudRate: 4800})

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


prompt.start();

prompt.get(['char_input', 'no_of_in'], function (err, result) {
    i = 0;
    while (i < result.no_of_in) {
      port.write(result.char_input, function(err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log('message written')
      })
      port.on('readable', function () {
        sleep(400)
        console.log('Data:', port.read())
      })
      i++;
    }
});

function onErr(err) {
    console.log(err);
    return 1;
}


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