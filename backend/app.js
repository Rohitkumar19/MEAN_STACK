const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const path = require('path') // to access the path on any OS
const app = express();

app.use(bodyParser.json());
///Connecting Database
mongoose.connect("mongodb+srv://Rohit:05hJDTnudMyT9etm@cluster0.73oer.mongodb.net/node-angular")
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Error=>" + err);
  })
app.use(bodyParser.urlencoded({ extended: false }))// for sending json response
/**
 * This middleware express.static ships with express
 * It allows access request to use this path. Below method checks any url request containing with images
 * will pass to backend/images
 */
app.use("/images", express.static(path.join("backend/images")))

//Headers set for CORS issue
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
})

app.use("/api/posts", postRoutes)
app.use("/api/user", userRoutes)

module.exports = app

