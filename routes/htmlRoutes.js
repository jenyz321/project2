var Members = require("../models/members");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    Members.find({}).then(function(member) {
      res.render("index", {
        msg: "Welcome!",
        examples: member
      });
    });
  });

  app.get("/", function(req, res) {
    Members.find({}).then(function(member) {
      res.render("registration", {
        msg: "Welcome!",
        examples: member
      });
    });
  });
  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  // app.get("*", function(req, res) {
  //   res.render("404");
  // });
};
