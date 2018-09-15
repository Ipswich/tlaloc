const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

var defaultContent = {
  location: "Salem, OR",
  degreeType: "F",
  sprinkler1Pin: 7,
  sprinkler2Pin: 8,
  sprinkler3Pin: 9,
  sprinkler4Pin: 10,
  fertilizePin: 21,
  heaterPin: 22,
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
    link1watering: false,
    link1temperature: false,
    link2watering: false,
    link2temperature: false,
    link3watering: false,
    link3temperature: false,
    link4watering: false,
    link4temperature: false,
  }
}

if(!db.has("settings").value())
{
  db.set("settings", defaultContent).write();
}
else defaultContent = db.get("settings").value();

settingsFunctions = {
  getSettingsData: function(){
    return db.get("settings").value();
  },

  //Zone 1 Settings
  setlink1name: function(val){
    db.set("settings.content.link2", val).write();
  },
  setlink1watering: function(val){
    console.log(val);
    db.set("settings.toggles.link1watering", val).write();
  },
  setlink1temperature: function(val){
    db.set("settings.toggles.link1temperature", val).write();
  },

  //Zone 2 Settings
  setlink2name: function(val){
    db.set("settings.content.link3", val).write();
  },
  setlink2watering: function(val){
    db.set("settings.toggles.link2watering", val).write();
  },
  setlink2temperature: function(val){
    db.set("settings.toggles.link2temperature", val).write();
  },

  //Zone 3 Settings
  setlink3name: function(val){
    db.set("settings.content.link4", val).write();
  },
  setlink3watering: function(val){
    db.set("settings.toggles.link3watering", val).write();
  },
  setlink3temperature: function(val){
    db.set("settings.toggles.link3temperature", val).write();
  },

  //Zone 4 Settings
  setlink4name: function(val){
    db.set("settings.content.link5", val).write();
  },
  setlink4watering: function(val){
    db.set("settings.toggles.link4watering", val).write();
  },
  setlink4temperature: function(val){
    db.set("settings.toggles.link4temperature", val).write();
  }

}

module.exports.defaultContent = defaultContent;
module.exports.settingsFunctions = settingsFunctions;
