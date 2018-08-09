const schedule = require('node-schedule');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

var allTimerObjects = [];

Sprinkler = {

  initializeDB: function(){
    db.defaults({}).write();
  },

  CreateSprinkler: function(name, gpioPin, fertilizePin){
    this.name = name;
    this.gpioPin = gpioPin;
    this.fertilizePin = fertilizePin
    this.timerObjects = [];
    // TODO: ASSIGN GPIO PINS TO RASPBERRY PI

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
    this.addTimer = function(startString, stopString){
      console.log("ADDING ENTRY. . .");
      db.get(this.name).push({startTime: startString, stopTime: stopString}).write();
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
    //Activate all timers and add returned objects to timerObjects array
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
      // TODO: SET RASPBERRY PI PIN TO HIGH
      console.log("ON")
    }

    //Triggered on stopTime on raspberry pi
    this.off = function(){
      // TODO: SET RASPBERRY PI PIN TO LOW
      console.log("OFF");
    }
  }
}

module.exports = Sprinkler;
