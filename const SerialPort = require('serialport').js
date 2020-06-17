const SerialPort = require('serialport')
const port = new SerialPort('COM3', {baudRate: 38400})

port.write('T', function(err) {
  if (err) {
    return console.log('Error on write: ', err.message)
  }
  console.log('message written')
})

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})

port.on('data', function (data) {
  console.log('Data:', data)
})