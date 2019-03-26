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
var databaseUri = "mongodb://localhost/codeConnectdb";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}
var db = mongoose.connection;
db.on("error", function(err) {
  console.log("Mongoose Error:" + err);
});

db.once("open", function() {
  console.log("Mongoos connection successful.");
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
      console.log("dbMember", dbMember);
      // If any Books are found, send them to the client
      res.json(dbMember);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.post("/login", function(req, res) {
  Members.findOne({ email: req.body.loginEmail })
    .then(function(dbMember) {
      console.log(req.body.loginEmail);

      console.log("dbMember", dbMember);
      // If any Books are found, send them to the client
      if (dbMember.password === req.body.loginPassword) {
        res.render("profile", dbMember);
      } else {
        console.log("Wrong password!");
        res.render("profile", dbMember);
      }
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.post("/register", function(req, res) {
  // Create a new member in the database
  Members.create(req.body)
    .then(function(dbMember) {
      //getMatches(req.body);
      console.log("dbMember", dbMember);
      // If the member was updated successfully, send it back to the client
      res.json(dbMember);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      console.log("There was an error signing up!");
      console.log(res.json(err));
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
//module.exports = app;
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
