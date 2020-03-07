var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");


//configure mongoose
mongoose.connect("mongodb://localhost/db", { useNewUrlParser: true });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var docSchema = new mongoose.Schema({
    subject_code: String,
    semester: String,
    pdf: String,
    body: String,
    author: String
});

app.get("/", function(req, res) {
    res.redirect("/home")
})


//Home page
app.get("/home", function(req, res) {
    res.render("home.ejs");
});


//About Page
app.get("/about",function(req,res){
    res.render("about.ejs");
})

//Semester pages

app.get("/sem1", function(req, res) {
    res.render("sem1.ejs");
});

app.get("/sem2", function(req, res) {
    res.render("sem2.ejs");
});

app.get("/sem3", function(req, res) {
    res.render("sem3.ejs");
});

app.get("/sem4", function(req, res) {
    res.render("sem4.ejs");
});

app.get("/sem5", function(req, res) {
    res.render("sem5.ejs");
});

app.get("/sem6", function(req, res) {
    res.render("sem6.ejs");
});

app.get("/sem7", function(req, res) {
    res.render("sem7.ejs");
});

app.get("/sem8", function(req, res) {
    res.render("sem8.ejs");
});



//Adding new docs to semester

app.get("/sem1/new/:id/:username", function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        res.redirect("new.ejs");
    } else {

        res.redirect("sem1.ejs");
    }
})

app.get("/sem2/new/:id/:username", function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        res.redirect("new.ejs");
    } else {

        res.redirect("sem2.ejs");
    }
})

app.get("/sem3/new/:id/:username", function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        res.redirect("new.ejs");
    } else {

        res.redirect("sem3.ejs");
    }
})

app.get("/sem4/new/:id/:username", function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        res.redirect("new.ejs");
    } else {

        res.redirect("sem4.ejs");
    }
})

app.get("/sem5/new/:id/:username", function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        res.redirect("new.ejs");
    } else {

        res.redirect("sem5.ejs");
    }
})

app.get("/sem6/new/:id/:username", function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        res.redirect("new.ejs");
    } else {

        res.redirect("sem6.ejs");
    }
})

app.get("/sem7/new/:id/:username", function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        res.redirect("new.ejs");
    } else {

        res.redirect("sem7.ejs");
    }
})

app.get("/sem8/new/:id/:username", function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        res.redirect("new.ejs");
    } else {

        res.redirect("sem8.ejs");
    }
})






app.listen(3000, function() {
    console.log("SERVER STARTED!!");
});