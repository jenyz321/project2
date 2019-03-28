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
};

//connection to mongo
var databaseUri = "mongodb://localhost/codeConnectdb";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}
var db = mongoose.connection;
db.on("error", function (err) {
  console.log("Mongoose Error:" + err);
});

db.once("open", function () {
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
app.get("/users", function (req, res) {
  Members.find({})
    .then(function (dbMember) {
      console.log("dbMember", dbMember);
      // If any Books are found, send them to the client
      res.json(dbMember);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.get("/register", function (req, res) {
  res.render("registration");
});

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/questions", function (req, res) {
  res.render("profile");
});

app.post("/login", function (req, res) {
  Members.findOne({ email: req.body.loginEmail })
    .then(function (dbMember) {
      console.log('in login')
      console.log(req.body.loginEmail);

      console.log("dbMember", dbMember);
      // If any Books are found, send them to the client
      if (dbMember.password === req.body.loginPassword) {
        app.locals.user = dbMember;
        res.render("profile", app.locals.user);
      } else {
        console.log("Wrong password!");
        app.locals.user = dbMember;
        res.render("profile", app.locals.user);
      }
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.post("/registerSubmit", function (req, res) {
  // Create a new member in the database
  Members.create(req.body)
    .then(function (dbMember) {
      //getMatches(req.body);
      console.log("dbMember", dbMember);
      // If the member was updated successfully, send it back to the client
      res.render("index", dbMember);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      console.log("There was an error signing up!");
      console.log(res.json(err));
    });
});

app.post("/submitQuestions/:id", function (req, res) {
console.log('in submitQueustions');
 // a = Object.values(req.body);
  let a = [1,3,4,1,3,4,5,3,1,]
  id = req.params.id;
  console.log(id);
  console.log(a);
  Members.findOneAndUpdate(
    { _id: id },
    {
      $push: { answers: a }
    }
  ).then(function (dbMember) {
    console.log(dbMember);
    dbMember.answers = [1,3,4,1,3,4,5,3,1,]
    res.render("index",dbMember);
  })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      console.log("There was an error saving your answers!");
      console.log(res.json(err));
    })
  });

  // a = Object.values(req.body);
  // id = req.params.id;
  // console.log('in questionssubmit')
  // console.log(id)
  // console.log(a);
  // //
  //   questionsUpdate(a, id);
 //   res.render("index", dbMember);
//})
// }
// );

//THIS IS JOE'S PROBLEM POINT
//For some reason I can't get it to re-render the page and display
//the "questions filled out" else statement. I hate handlebars

// res.render("profile", app.locals.user);
// });

app.post("/submitLanguages/:id", function (req, res) {
  a = Object.values(req.body);
  id = req.params.id;
  console.log(a);
  a.forEach(function (e) {
    languagesUpdate(e, id);
  });
});

app.delete("/delete/:id", function (req, res) {
  // Remove a note using the objectID
  Members.findOneAndRemove(
    {
      _id: req.params.id
    },
    function (error, removed) {
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


function questionsUpdate(a, id) {
  console.log('in questionsUpdate')
  console.log(a);
  Members.findOneAndUpdate(
    { _id: id },
    {
      $push: { answers: a }
    }
  ).then(function (dbMember) {
    console.log(dbMember);
  });
}

function languagesUpdate(a, id) {
  Members.findOneAndUpdate(
    { _id: id },
    {
      $push: { languages: a }
    }
  ).then(function (dbMember) {
    console.log(dbMember);
  });
}

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});