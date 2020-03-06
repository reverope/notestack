var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");


//configure mongoose
mongoose.connect("mongodb://localhost/db");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var docSchema = new mongoose.Schema({
    subject_code: String,
    semester: String,
    pdf: String,
    body: String,
    author: String

});

app.get("/",function(req,res){
    res.redirect("/home")
})

app.get("/home", function(req, res) {
    res.render("home.ejs");
});

app.get("/sem1",function(req,res){
    res.render("sem1.ejs");
})

app.get("/sem1/new/:id/:username",function(req,res){
    if(req.params.id=="333745"&& req.params.username=="admin")
    {
        res.redirect("new.ejs");
    }
    else{

        res.redirect("sem1.ejs");
    }
})

app.listen(3000, function() {
    console.log("SERVER STARTED!!");
});