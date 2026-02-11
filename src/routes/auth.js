const express = require("express");
const authRouter = express.Router();
const { validateSignUp } = require("../utils/validatations");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    age,
    gender,
    photoUrl,
    country,
    skills,
    about,
  } = req.body;
  try {
    validateSignUp(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      country,
      skills,
      about,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      success: true,
      message: "User signedup in successfully",
      data: savedUser,
    });
  } catch (err) {
    res.status(500).send("Error in signing up the user" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid login credentials");
    }
    const isPasswordValid = await user.bcryptPassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
      });
    } else {
      throw new Error("Invalid login credentials");
    }
  } catch (err) {
    res.status(500).send("Error in logging in the user" + err.message);
  }
});
authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", "", {
      expires: new Date(),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .send("User logged out successfully");
});
module.exports = authRouter;
