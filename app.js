// use express package
const express = require("express");

// use https node inbuilt package
const https = require("https");

// use body parser package to parse the post requests
const bodyParser = require("body-parser");

// Loading config file for API key, audience key
require("dotenv").config();

// create web app
const app = express();

// use static files like css and basic javascript functions to send
app.use(express.static("public"));

// use body parser in web app
app.use(bodyParser.urlencoded({extended: true}));

// root of the webApp (html and its css) -> get request from the browser
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + "public/" + "home.html");
});

// post to the webApp root
app.post("/", function(req, res) {

  var placeName = req.body.placeName;
  const units = "metric";
  const apiKey = (process.env.API_KEY || process.env.LOCAL_API_KEY);
  const url = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + placeName + "&appid=" + apiKey + "&units=" + units;

  https.get(url, function (response) {
    response.on("data", function (data) {

      if (String(response.statusCode) === "200") {
        parsed_data = JSON.parse(data);
        weather_icon_url = "http://openweathermap.org/img/wn/" + parsed_data.weather[0].icon + ".png";
        res.send("<link rel='stylesheet' href='css/output.css'></link> \
                  <h1>Weather</h1> \
                  <h3>"+ parsed_data.name + "</h3> \
                  <p>" + parsed_data.main.temp + " &deg;C</p> \
                  <img src='" + weather_icon_url + "'> \
                  <p>" + parsed_data.weather[0].main + "</p> \
                  <form action='/home' method='POST'> \
                    <a href='/home'><button class='btn' type='submit'>Check Other City</button></a> \
                  </form>"
               );
      }
      else {
        res.sendFile(__dirname + "/" + "public/" + "failure.html");
      }
    });
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.post("/home", function (req, res) {
  res.redirect("/");
})

// Server start (web app listening to local server)
port = (process.env.PORT || 3000);
app.listen(port ,function () {
  console.log("Server is started with port " + port);
});
