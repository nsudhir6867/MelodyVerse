const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { getToken } = require("../utils/helper");

const router = express.Router();

router.post("/register", async (req, res) => {
  //My req.body will be in the form of {firstName, lastName, email,password}
  const { firstName, lastName, email, username, password } = req.body;
  //Searching for user if exist
  const user = await User.findOne({ email: email });
  if (user) {
    return res
      .status(403)
      .json({ error: "A user with this email already exists" });
  }
  //User creation if user doesn't exist
  const hashedPassword = await bcrypt.hash(password, 10); //10 is salt.
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    username,
    password: hashedPassword,
  });
  //Creation of unique token for the created user.
  const token = await getToken(email, password);
  //return the result to the user
  const userToReturn = { ...newUser.toJSON(), token };
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(403).json({ error: "Invalid Credentials" });
  }
  //user exists
  console.log(user);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(403).json({ error: "Invalid credentials" });
  }
  //password is valid
  const token = await getToken(user.email, user);
  const userToReturn = { ...user.toJSON(), token };
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

module.exports = router;
