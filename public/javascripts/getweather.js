module.exports = {
  getWeather: function(callback){
    //Prepare date/time for document
    var date = new Date();
    var timeFormatter = function(date){
      var hours = date.getHours();
      var hoursMeridian = (hours >= 12) ? "PM" : "AM";
      var hours = (hours > 12) ? hours - 12 : hours;
      var minutes = date.getMinutes();
      var content;
      if (minutes < 10)
        minutes = "0" + minutes;

      return hours + ":" + minutes + " " + hoursMeridian;
    }

    //Prepare weather for document - requires connection (ASYNC)
    var weatherdata;
    var error;

    weather.find({search: 'Salem, OR', degreeType: 'F'}, function(err, result) {
      if(err)
        error = "Weather could not be loaded."
      weatherdata = result[0];

        content = {
        sidebarTitle: "Tlaloc",
        sidebarHeading: "Sprinkler Controller",
        link1: "Overview",
        link2: "Sprinklers",
        link2Sublink1: "Sprinkler 1",
        link2Sublink2: "Sprinkler 2",
        link2Sublink3: "Sprinkler 3",
        link2Sublink4: "Sprinkler 4",
        link3: "Existing Rules",
        link4: "Create Rule",
        time: date.toDateString() + ", " + timeFormatter(date),
        weatherdata: weatherdata,
        error: error
      }
      callback();
  }
}
