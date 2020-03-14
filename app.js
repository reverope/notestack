var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require('method-override');



//configure mongoose
mongoose.connect("mongodb://localhost/db", { useNewUrlParser: true });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

var docSchema = new mongoose.Schema({
    subject_code: String,
    semester: String,
    subject_topic: String,
    pdfurl: String,
    author: String,
    authorsection: String,
    dateuploaded: String
});

//Create Mongoose Model
var Doc = mongoose.model("Doc", docSchema);

//Default Routing
app.get("/", function(req, res) {
    res.redirect("/home")
})


//Home page
app.get("/home", function(req, res) {
    res.render("index.ejs");
});


//About Page
app.get("/about", function(req, res) {
    res.render("about.ejs");
})

//Team Page
app.get("/meettheteam", function(req, res) {
    res.render("meettheteam.ejs");
})

//Error Page
app.get("/error", function(req, res) {
    res.render("error.ejs");
})

//Show All Records
app.get("/sem/:x/showAllDocs", function(req, res) {
    Doc.find({ semester: req.params.x }, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.render("showAllDocs.ejs", { doc: doc });
        }
    })
})

// Default Route for Semester Pages

app.get("/sem/:x", function(req, res) {
    // x is the semester number
    Doc.find({ semester: req.params.x }, function(err, doc) {
        res.render("sem" + req.params.x + ".ejs", { doc: doc });
    })
});

//When we have to add to semester number 'x'
app.get("/new/:id/:username/sem/:x", function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        res.render("new.ejs", { number: req.params.x });
    } else {
        res.redirect("error.ejs");
    }
})

//Post request to submit the form in database########################################################

//CREATE ROUTE

app.post("/:x", function(req, res) {
    Doc.create(req.body.doc, function(err, newDoc) {
        if (err) {
            res.render("new.ejs");
        } else {
            res.redirect("/sem/" + req.params.x);
            console.log("posted in " + req.params.x);
            console.log("id:" + newDoc._id);
        }
    })
})

//Delete route
app.delete("/:x/delete/:id", function(req, res) {
    Doc.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            res.redirect("/sem/" + req.params.x);
        } else {
            res.redirect("/sem/" + req.params.x);
        }
    })
})

//########################################################

app.listen(3000, function() {
    console.log("SERVER STARTED!!");
});