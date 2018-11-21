const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

var defaultContent = {
  settings: {
    location: "Salem, OR",
    degreeType: "F",
    sprinkler1Pin: 5,
    sprinkler2Pin: 6,
    sprinkler3Pin: 7,
    sprinkler4Pin: 8,
    coolerPin: 9,
    heaterPin: 10,
    thermometerPin: 11,
    fertilizePin: 12,
    //WEBSITE DATA
    content: {
      sidebarTitle: "Tlaloc",
      sidebarHeading: "Sprinkler Controller",
      link1: "Overview",
      link2: "Zone 1",
      link3: "Zone 2",
      link4: "Zone 3",
      link5: "Zone 4",
      Sublink1: "Watering",
      Sublink2: "Temperature",
      linkLast: "Settings"
    },
    toggles: {
      sprinkler1watering: true,
      sprinkler1temperature: true,
      sprinkler2watering: true,
      sprinkler2temperature: true,
      sprinkler3watering: true,
      sprinkler3temperature: true,
      sprinkler4watering: true,
      sprinkler4temperature: true,
    }
  },
  sprinkler1: [],
  sprinkler1CoolTemp: {
    coolTemp: 85,
    state: false
  },
  sprinkler1HeatTemp: {
    heatTemp: 65,
    state: false
  },
  sprinkler2: [],
  sprinkler2CoolTemp: {
    coolTemp: 85,
    state: false
  },
  sprinkler2HeatTemp: {
    heatTemp: 65,
    state: false
  },
  sprinkler3: [],
  sprinkler3CoolTemp: {
    coolTemp: 85,
    state: false
  },
  sprinkler3HeatTemp: {
    heatTemp: 65,
    state: false
  },
  sprinkler4: [],
  sprinkler4CoolTemp: {
    coolTemp: 85,
    state: false
  },
  sprinkler4HeatTemp: {
    heatTemp: 65,
    state: false
  }
}

settingsFunctions = {

  getSettingsData: function(){
    db.read();
    return db.get("settings").cloneDeep().value();
  },

  setDegreeType: function(val) {
    db.set("settings.degreeType", val).write();
  },

  //Zone 1 Settings
  setlink1name: function(val){
    db.set("settings.content.link2", val).write();
  },
  setsprinkler1watering: function(val){
    db.set("settings.toggles.sprinkler1watering", val).write();
  },
  setsprinkler1temperature: function(val){
    db.set("settings.toggles.sprinkler1temperature", val).write();
  },

  //Zone 2 Settings
  setlink2name: function(val){
    db.set("settings.content.link3", val).write();
  },
  setsprinkler2watering: function(val){
    db.set("settings.toggles.sprinkler2watering", val).write();
  },
  setsprinkler2temperature: function(val){
    db.set("settings.toggles.sprinkler2temperature", val).write();
  },

  //Zone 3 Settings
  setlink3name: function(val){
    db.set("settings.content.link4", val).write();
  },
  setsprinkler3watering: function(val){
    db.set("settings.toggles.sprinkler3watering", val).write();
  },
  setsprinkler3temperature: function(val){
    db.set("settings.toggles.sprinkler3temperature", val).write();
  },

  //Zone 4 Settings
  setlink4name: function(val){
    db.set("settings.content.link5", val).write();
  },
  setsprinkler4watering: function(val){
    db.set("settings.toggles.sprinkler4watering", val).write();
  },
  setsprinkler4temperature: function(val){
    db.set("settings.toggles.sprinkler4temperature", val).write();
  }

}

module.exports.defaultContent = defaultContent;
module.exports.settingsFunctions = settingsFunctions;
