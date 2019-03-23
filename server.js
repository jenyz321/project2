
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
//var db = require("./models");
var Members = require("./models/members");
var logger = require("morgan");
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

//connection to mongo
mongoose.connect("mongodb://localhost/codeConnectdb", {
  useNewUrlParser: true
});

// app.post("/library", function(req, res) {
//   db.Library.create({ name: "Code Members" })
//     .then(function(dbLibrary) {
//       // If saved successfully, print the new Library document to the console
//       console.log(dbLibrary);
//     })
//     .catch(function(err) {
//       // If an error occurs, print it to the console
//       console.log(err.message);
//     });
// });

//Routes
app.get("/users", function(req, res) {
  Members.find({})
    .then(function(dbMember) {
      console.log('dbMember', dbMember);
      // If any Books are found, send them to the client
      res.json(dbMember);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});
//To do reviewing a match
//app.get("/", function (req, res) {

// });

app.post("/submit", function(req, res) {
  // Create a new Book in the database
  Members.create(req.body)
    .then(function(dbMember) {
      // If the Library was updated successfully, send it back to the client
   //   getMatches(req.body);
      res.json(dbMember);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.delete("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  Members.findOneAndRemove(
    {
      _id: req.params.id
    },
    function(error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        res.send(removed);
      }
    }
  );
});

const  getMatches=()=>{
  console.log('in matches')
  //Comparing user with their best members match
  var totalDifference = 0;
  //Object to hold the best match
  //var coderMatch = {
  //  name: "",
 //   photo: "",
  //  membersDifference: 50
 // };
   // Here we take the result of the user's survey POST and parse it.
  var userData = req.body;
  var userName = userData.name;
  var userScores = userData.scores;
  console.log("userData"   + userData);
  console.log("userName " + userName);
  // Converting the users score to a number (Instead of string)
  var userScoresNum = userScores.map(function (item) {
    return parseInt(item, 10);
  });
   userData = {
    "name": req.body.name,
    "photo": req.body.photo,
    "scores": userScoresNum
  };
  console.log(userData);

  console.log("Name: " + userName);
  console.log("User Score " + userScores);
   console.log('userScoreNum outside function ' + userScoresNum);
   // Converting the users score to a sum number (Adds up all the numbers in array)
  //
  var userScoresSum = userScoresNum.reduce((tot, amt) => tot + amt, 0);
   console.log("Sum of users score " + userScoresSum);
  console.log("Best match members diff " + coderMatch.membersDifference);

  // console.log("+++++++=================++++++++++");
   // Loop through all the members possibilities in the database.
  for (var i = 0; i < memberssData.length; i++) {
     console.log(memberssData[i].name);
    totalDifference = 0;
    console.log("Total Diff " + totalDifference);
    console.log("Best match members diff " + coderMatch.membersDifference);
     var membersScoreSum = memberssData[i].scores.reduce((tot, amt) => tot + amt, 0);
    console.log("Total members score " + membersScoreSum);
    totalDifference += Math.abs(userScoresSum - membersScoreSum);
    console.log(" -------------------> " + totalDifference);
       coderMatch.name.push(memberssData[i].name);
        coderMatch.photo.push(memberssData[i].photo);
        coderMatch.membersDifference.push(totalDifference);
     }
    console.log(totalDifference + " Total Difference");
    console.log(coderMatch);
    // Finally save the user's data to the database (this has to happen AFTER the check. otherwise,
    // the database will always return that the user is the user's best members).
    memberssData.push(userData);
    console.log("New User added");
    console.log(userData);
    // Return a JSON with the user's coderMatch. This will be used by the HTML in the next page.
    res.json(coderMatch);
   };


//module.exports = app;
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
