const express = require("express");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoute = require("./routes/auth");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;

app.use(express.json());

//Connecting to mongodb database
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

//passport-jwt
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "OmNamahShivay";
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

app.get("/", (req, res) => {
  res.send("Hello! We can develop now");
});

app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log("listening to port 8000");
});

//Setup passport jwt
