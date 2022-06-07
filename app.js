require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/usersDB");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// database

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


userSchema.plugin(encrypt, { secret: process.env.MYSECRET, encryptedFields: ["password"] });

const User = mongoose.model("user", userSchema);

// home

app.route("/").get(function (req, res) {
  res.render("home");
});

// login

app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    const userName = req.body.username;
    const userPassword = req.body.password;

    User.findOne({ email: userName }, function (err, founduser) {
      if (err) {
        console.log(err);
      } else {
        if (founduser) {
          if (founduser.password === userPassword) {
            res.render("secrets");
          }
        }
      }
    });
  });
// register

app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser.save(function (err) {
      if (!err) {
        res.render("secrets");
      }
    });
  });

app.listen(3000, function (req, res) {
  console.log("Server Started on PORT 3000");
});
