var express = require("express");
var app = express();
var mongoose = require("mongoose");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var cookieSession = require("cookie-session");
var GoogleStrategy = require("passport-google-oauth20");
require("dotenv").config();
const key = require("./keys");

var User = require("./models/users");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["notestackisawesome"],
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Configure Mongoose

mongoose.connect(process.env.DBSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//mongoose.connect("mongodb://localhost/db",{ useNewUrlParser: true,useUnifiedTopology: true })

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// GoogleSignIn //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
passport.use(
  "google",
  new GoogleStrategy(
    {
      callbackURL: "/google/redirect",
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
          console.log("User Found in Database: " + currentUser);
        } else {
          console.log("Creating New User");
          new User({
            username: profile.displayName,
            googleId: profile.id,
          })
            .save()
            .then((newUser) => {
              console.log("Strategy Callback: " + newUser + " was created");
              done(null, newUser);
            });
        }
      });
    }
  )
);
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////??????

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

app.use(
  require("express-session")({
    secret: "This is our project",
    resave: false,
    saveUninitialized: false,
  })
);

var docSchema = new mongoose.Schema({
  subject_code: String,
  semester: String,
  subject_topic: String,
  pdfurl: String,
  author: String,
  authorsection: String,
  dateuploaded: String,
});

//Create Mongoose Model
var Doc = mongoose.model("Doc", docSchema);

//SigInRoute
app.get(
  "/oath/google",
  passport.authenticate("google", { scope: ["profile"] })
);

const authCheck = (req, res, next) => {
  if (!req.user) {
    console.log("AuthCheck was called. The User is not authenticated");
    res.redirect("/login");
  } else {
    next();
  }
};

app.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/sem/1");
  console.log(req.user);
});

//Default Routing
app.get("/", function (req, res) {
  res.redirect("/home");
});

//Home page
app.get("/home", function (req, res) {
  if (req.isAuthenticated()) {
    console.log(req.user.username);
  }
  res.render("index.ejs", {
    value: req.isAuthenticated(),
    name: req.isAuthenticated() ? req.user.username : " ",
  });
});

//Under Develepment page
app.get("/udp", function (req, res) {
  res.render("udp.ejs");
});
//About Page
app.get("/about", function (req, res) {
  res.render("about.ejs");
});

//Idea Page
app.get("/idea", function (req, res) {
  res.render("idea.ejs");
});

//Services Page
app.get("/services", function (req, res) {
  res.render("udp.ejs");
});

//Team Page
app.get("/meettheteam", function (req, res) {
  res.render("meettheteam.ejs");
});

//Error Page
app.get("/error", function (req, res) {
  res.render("error.ejs");
});

//Secret Page
//When person will be logged in he will be redirected to home
// app.get("/secret", function (req, res) {
//   res.render("index.ejs");
// });

//Register page Opening

// app.get("/register", function (req, res) {
//   res.render("register.ejs");
// });

//Post to /register and register to access materials

// app.post("/register", function (req, res) {
//   User.register(
//     new User({ username: req.body.username }),
//     req.body.password,
//     function (err, user) {
//       if (err) {
//         console.log(err);
//         return res.render("register.ejs");
//       }
//       passport.authenticate("local")(req, res, function () {
//         res.redirect("/sem/1");
//       });
//     }
//   );
// });

//Render login form
app.get("/login", function (req, res) {
  res.render("login.ejs");
});

// Login logic
// app.post(
//   "/login",
//   passport.authenticate("google", {
//     successRedirect: "/sem/1",
//     failureRedirect: "/login",
//   }),
//   function (req, res) {}
// );

// Logout Route
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// Default Route for Semester Pages

app.get("/sem/:x", authCheck, function (req, res) {
  // x is the semester number
  console.log("Authentication Status : " + req.isAuthenticated());
  Doc.find({ semester: req.params.x }, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.render("sem" + req.params.x + ".ejs", { doc: doc });
    }
  });
});

//Show All Records
app.get("/sem/:x/:id/:username/showAllDocs", function (req, res) {
  if (req.params.id == "333745" && req.params.username == "admin") {
    Doc.find({ semester: req.params.x }, function (err, doc) {
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
app.get("/new/:id/:username/sem/:x", function (req, res) {
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
app.post("/:x", function (req, res) {
  if (req.params.x >= 0 && req.params.x <= 8) {
    Doc.create(req.body.doc, function (err, newDoc) {
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
app.delete("/sem/:x/delete/:id", function (req, res) {
  Doc.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      //Redirect to the show all docs page
      res.redirect("/sem/" + req.params.x + "/showAllDocs");
    } else {
      res.redirect("/sem/" + req.params.x);
    }
  });
});

app.get("*", function (req, res) {
  res.redirect("/error");
});

//########################################################

app.listen(process.env.PORT || 3000, function () {
  console.log("SERVER STARTED!!");
});

//########################################################
