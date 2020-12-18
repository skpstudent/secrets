//jshint esversion:6

// L377 SET UP files dissapeared!!

// Recoded by me!!
// 

//  Require the necessary packages
// L381 dotenv should be given priority (check its docs)
// 
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// L380 mongoose-encryption
// 
const encrypt = require("mongoose-encryption");

const app = express();

// L381 accessing .env variables
// 
console.log(process.env.API_KEY);


// use the 'public' folder to access static files such as CSS
// 
app.use(express.static("public"));

// set up the ejs templating engine
// 
app.set('view engine', 'ejs');

// use body parser to send details to-from the forms containing user input
// 
app.use(bodyParser.urlencoded({ extended: true }));

// L378 connect to userDB via mongoose
// 
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

// L378 schema (JS object) created
// L380 basic schema changed mongoose schema object
// created from the mongoose schema 'class'
// 
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// L380 new const holding long string, this 'key' will be used to encrypt the database
// L381 this was moved to the .env file
// 
// 


// L380 plugin used to pass over the string as JS object
// only the sceificied field will be encrypted
// important that plugin is declared here before the mongoose model below
// L381 process.env.SECRET accesses the .env file for the encryption key
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });



// L378 model created based on above schema
// 
const User = new mongoose.model("User", userSchema);




// L377 GET routes added for home, login and register pages
// 
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

// L378 post username and password details from register page
// 
app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});


// L378 at login page check username and password inside userDB
// 
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // begin with checking the email address...
    // 
    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        // ... then check the password
        // 
        else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                    // Following will show p/w in console/terminal
                    // 
                    // console.log(password);
                }
            }
        }
    });
});

// listen at port 3000 for data
// 
app.listen(3000, function () {
    console.log("Server started on port 3000.");
});


