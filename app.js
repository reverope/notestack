var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");


//configure mongoose
mongoose.connect("mongodb://localhost/our_webpage");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var docSchema = new mongoose.Schema({
    subject_code: String,
    semester: String,
    pdf: String,
    body: String,
    author: String

});

app.get("/home", function(req, res) {
    res.render("home.ejs");
});

app.listen(3000, function() {
    console.log("SERVER STARTED!!");
});