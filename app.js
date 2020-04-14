var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


var User = require("./models/users");


//Configure Mongoose

mongoose.connect(
    "mongodb+srv://dbUser:NOTESTACKforever123@notestackcluster-lmqsh.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }
);
//mongoose.connect("mongodb://localhost/db",{ useNewUrlParser: true,useUnifiedTopology: true })

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.use(require("express-session")({
    secret: "This is our project",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
    res.redirect("/home");
});

//Home page
app.get("/home", function(req, res) {
    res.render("index.ejs");
});

//Under Develepment page
app.get("/udp", function(req, res) {
    res.render("udp.ejs");
});
//About Page
app.get("/about", function(req, res) {
    res.render("about.ejs");
});

//Idea Page
app.get("/idea", function(req, res) {
    res.render("idea.ejs");
});

//Services Page
app.get("/services", function(req, res) {
    res.render("udp.ejs");
});

//Team Page
app.get("/meettheteam", function(req, res) {
    res.render("meettheteam.ejs");
});

//Error Page
app.get("/error", function(req, res) {
    res.render("error.ejs");
});

//Secret Page 
//When person will be logged in he will be redirected to home
app.get("/secret", isLoggedIn, function(req, res) {
    res.render("sem1.ejs");
})

//Register page Opening 
app.get("/register", function(req, res) {
    res.render("register.ejs");
});

//Post to /register and register to access materials
app.post("/register", function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/secret");
        })

    })
});

//Render login form
app.get("/login", function(req, res) {
    res.render("login.ejs");
})

//Login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res) {});

//Logout Route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

// Default Route for Semester Pages

app.get("/sem/:x", isLoggedIn, function(req, res) {
    // x is the semester number
    Doc.find({ semester: req.params.x }, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.render("sem" + req.params.x + ".ejs", { doc: doc });
        }
    });
});

//Show All Records
app.get("/sem/:x/:id/:username/showAllDocs", isLoggedIn, function(req, res) {
    if (req.params.id == "333745" && req.params.username == "admin") {
        Doc.find({ semester: req.params.x }, function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.render("showAllDocs.ejs", { doc: doc, number: req.params.x });
            }
        });
    } else {
        res.redirect("/error");
    }
});

//When we have to add to semester number 'x'
app.get("/new/:id/:username/sem/:x", isLoggedIn, function(req, res) {
    if (
        req.params.id == "333745" &&
        req.params.username == "admin" &&
        req.params.x >= 0 &&
        req.params.x <= 8
    ) {
        res.render("new.ejs", { number: req.params.x });
    } else {
        res.redirect("/error");
    }
});

//Post request to submit the form in database########################################################

//CREATE ROUTE

// Suppose we have to add notes in sem number "x" we use this post route to do so.
app.post("/:x", isLoggedIn, function(req, res) {
    if (req.params.x >= 0 && req.params.x <= 8) {
        Doc.create(req.body.doc, function(err, newDoc) {
            if (err) {
                res.render("new.ejs", { number: req.params.x });
                console.log(err);
            } else {
                res.redirect("/sem/" + req.params.x);
                console.log("posted in sem" + req.params.x);
                console.log("id:" + newDoc._id);
            }
        });
    } else {
        res.redirect("/error");
    }
});

//Delete route
app.delete("/sem/:x/delete/:id", isLoggedIn, function(req, res) {
    Doc.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            //Redirect to the show all docs page
            res.redirect("/sem/" + req.params.x + "/showAllDocs");
        } else {
            res.redirect("/sem/" + req.params.x);
        }
    });
});

//function to check that only authenticated user can access the sites
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.get("*", function(req, res) {
    res.redirect("/error");
});

//########################################################

app.listen(process.env.PORT || 3000, function() {
    console.log("SERVER STARTED!!");
});

// notestack@333745