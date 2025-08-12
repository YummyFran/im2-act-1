const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("../models/authModel");

const signup = async (req, res) => {
  const { fname, lname, age, email, password } = req.body;

  let errors = [];

  if (!fname) errors.push({ message: "First name is required." });
  if (!lname) errors.push({ message: "Last name is required." });
  if (!age) errors.push({ message: "Age is required." });
  if (!email) errors.push({ message: "Email is required." });
  if (!password) errors.push({ message: "Password is required." });

  if (errors.length > 0)
    return res.status(400).json({ success: false, errors });

  try {
    const emailExist = await authModel.findUserByEmail(email);

    if (emailExist)
      return res
        .status(409)
        .json({ success: false, message: "Email already exists!" });

    const uid = uuid();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await authModel.signup({
      uid,
      fname,
      lname,
      age,
      email,
      hashedPassword,
    });

    const token = jwt.sign({ id: newUser.uid }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ success: true, message: "User Created", user: newUser });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  let errors = [];

  if (!email) errors.push({ message: "Email is required." });
  if (!password) errors.push({ message: "Password is required." });

  if (errors.length > 0)
    return res.status(400).json({ success: false, errors });

  try {
    const user = await authModel.findUserByEmail(email);

    if (!user)
      return res.status(400).json({
        success: false,
        emailError: "Email not found",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        passwordError: "Incorrect password",
      });

    const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await authModel.findUserById(userId)

    res.json({ success: true, user })
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  signup,
  login,
  getCurrentUser,
};
