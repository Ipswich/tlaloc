const schedule = require('node-schedule');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const config = require('../config')
const Gpio = require('onoff').Gpio


var allTimerObjects = [];
var fertilizePin = config.fertilizePin;

var Sprinkler = {

  //Initializes JSON Database if it does not exist.
  initializeDB: function(){
    if(db.getState() == 'undefined'){
      db.defaults({}).write();
    }
    else {
      console.log("DB already exists, skipping DB creation. . .")
    }
  },

  //Parses input into string for timers
  inputParser: (minute, hour, dayOfMonth, month, dayOfWeek) => {
    let outputString = ("0 " + minute + " " + hour + " " + dayOfMonth + " * " + dayOfWeek)
    return outputString;
  },

  CreateSprinkler: function(name, gpioPin){
    this.name = name;
    this.gpioPin = gpioPin;
    this.fertilizePin = fertilizePin
    this.timerObjects = [];
    var pin;
    if (Gpio.accessible) {
      pin = new Gpio(this.gpioPin, 'out')
    } else {
        console.log('Virtual sprinkler now uses value: ' + this.gpioPin);
    }

    if(!db.has(this.name).value())
      db.set(name, []).write();

    //////////////////////////
    //LOW DB STORAGE METHODS//
    //////////////////////////
    //Returns the entire array of start/stop pairs
    this.getSchedule = function(){
      if(db.has(this.name).value()){
        return db.get(this.name).value();
      }
      else {
        console.log("NO SCHEDULE")
      }
    }

    //Returns the pair of start/stop times by index
    this.getTimerByIndex = function(index){
      let string = this.name + '[' + index + ']';
      if(db.has(string).value()){
        return db.get(string).value();
      }
      else{
        console.log("NO TIMERS");
      }
    }

    //Adds a timer to the database
    this.addTimer = function(startString, stopString, fertilize){
      console.log("ADDING ENTRY. . .");
      db.get(this.name).push({startTime: startString, stopTime: stopString, fertilizeState: fertilize}).write();
    }

    //Removes a timer from the database by index
    this.removeTimerByIndex = function(index){
      let string = this.name + '[' + index + ']';
      if(db.has(string).value()) {
        console.log("REMOVING ENTRY . . .")
        db.set(string, {removeMe: 1}).write();
        db.get(this.name).remove({removeMe: 1}).write();
      }
      else {
        console.log("NO TIMER TO DELETE");
      }
    }

    ////////////////////////
    //SCHEDULING FUNCTIONS//
    ////////////////////////
    //Activate all timers and add returned objects to timerObjects array.
    //Commits entries from DB into the app, filling the timer array
    this.commitAllTimers = function(){
      let list = this.getSchedule();
      let length = list.length;
      for(let i = 0; i < length; i++){
        this.timerObjects.push(schedule.scheduleJob(list[i].startTime, this.on));
        this.timerObjects.push(schedule.scheduleJob(list[i].stopTime, this.off));
      }
    }

    //Cancel all timers and clear timerObjects array
    this.cancelAllTimers = function(){
      let length = this.timerObjects.length;
      for(let i = 0; i < length; i++){
        this.timerObjects[i].cancel();
      }
      this.timerObjects = [];
    }

    ////////////////////
    //ON-OFF FUNCTIONS//
    ////////////////////
    //Triggered on startTime on raspberry pi
    this.on = function(){
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(1);
        process.on('SIGINT', () => {
          pin.unexport();
        });
      }
      else {
        console.log("ON")
      }
    }

    //Triggered on stopTime on raspberry pi
    this.off = function(){
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(0);
        process.on('SIGINT', () => {
          pin.unexport();
        });
      }
      else {
        console.log("OFF")
      }
    }
  }
}

module.exports = Sprinkler;
