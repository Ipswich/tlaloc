// content of index.js
const five = require('johnny-five');
const http = require('http')
const port = 3000
var thermometer1
var thermometer2

var arduino = new five.Board({repl: false});
arduino.on("ready", function(){
  console.log("Arduino has connected successfully.\n")
  thermometer1 = new five.Thermometer({
    controller: "DS18B20",
    pin: 10,
    // address: 0x417c1f1deff,
    freq: 1000 * 60 * 5
  });
  // thermometer2 = new five.Thermometer({
  //   controller: "DS18B20",
  //   pin: 10,
  //   address: 0x417c1feafff,
  //   freq: 1000 * 60 * 5
  // });
})

const requestHandler = (request, response) => {
  console.log(request.url)
  temperature = thermometer1.celsius
  console.log(thermometer1.address.toString(16))
  console.log(thermometer1.F)
  response.end('Temperature C: ' + temperature)
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
