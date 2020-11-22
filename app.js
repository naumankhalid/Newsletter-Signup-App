const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.listen(3000, function(){
  console.log("Server is running on port 3000");
});


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.first;
  const lastName = req.body.last;
  const email = req.body.email;
  console.log("Thank you for signing up " + firstName + "! Your details are:\nFirst Name: "+ firstName + "\nLast Name: " + lastName + "\nEmail: " + email);

// Creating data that needs to be passed in the POST request to Mailchimp's API

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
      }
    ]

  };

const jsonData = JSON.stringify(data);   // converting JSON data into string

  //HTTPS request to Mailchimp API to add user to mailing list. https.request takes in url, options and callback function

    const url = process.env.URL;
    const options = {
      auth: process.env.AUTH,
      method: 'POST'
    };

    const request = https.request(url, options, function(response){

      if (response.statusCode === 200){
        console.log("Subscribed successfully.")
        res.sendFile(__dirname + "/success.html");
      }
      else{
        console.log("Error")
        res.sendFile(__dirname + "/failure.html");
      }

      response.on("data", function(data){
          console.log(JSON.parse(data));
      });

    });

    request.write(jsonData);
    request.end();



  // res.sendFile(__dirname + "/success.html");
});


app.post("/failure", function(req, res){
  res.redirect("/");
})
