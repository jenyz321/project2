require("dotenv").config();
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
      res.json(dbMember);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

//module.exports = app;
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
