//Nodejs code is here
var express = require("express");
var requests = require("requests");
var app = express();
require('dotenv').config();

API=process.env.API_URL

var bodyParser = require("body-parser");


app.use("/public", express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("Request made on:" + req.url);


  requests(API)
    .on("data", function (chunk) {
      const objdata = JSON.parse(chunk); 

      const time = new Date().toLocaleTimeString();

      res.render("weather", { apidata: objdata, time: time });
      console.log(objdata);
    })
    //else through error
    .on("end", function (err) {
      if (err) return console.log("connection closed due to errors", err);
      console.log("end");
    });
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.post("/", urlencodedParser, function (req, res) {
  var reqCity = req.body.city; //data that was submitted by user
  requests(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      reqCity +
      "&appid=344b134b52cf63f9d28bb5e7ea69259b&units=metric"
  )
    .on("data", function (chunk) {
      const objdata = JSON.parse(chunk);
      const time = new Date().toLocaleTimeString();

      console.log("weather requested :" + req.body.city);
      if (objdata) {
        res.render("weather", { apidata: objdata, time: time });
      }
      console.log(objdata);
    })
    .on("end", function (err) {
      if (err) return console.log("connection closed due to errors", err);
      console.log('something went wrong')
      console.log("end");
    });
});
 const PORT=process.env.PORT||5000;
//this express app server listen on port 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

