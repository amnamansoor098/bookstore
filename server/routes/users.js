var express = require("express");
var router = express.Router();
var userModel = require("../db/user");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

router.post("/logout", function (req, res, next) {
  res.clearCookie("token", {
    httpOnly: true,
  });
  let loggedOut = true;
  res.json({ loggedOut, message: "User logged out!" });
});

router.post("/login", async function (req, res) {
  try {
    let { username, password } = req.body;

    // Find user
    let user = await userModel.findOne({ username });
    if (!user) {
      return res.json({ logged: false, message: "User not found" });
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error during password comparison:", err);
        return res
          .status(500)
          .json({ logged: false, message: "Internal Server Error" });
      }

      if (result) {
        // Set cookie
        let token = jwt.sign({ username }, "shaiq-auth");
        res.cookie("token", token, {
          httpOnly: true,
        });

        return res.json({ logged: true, message: "User logged in!" });
      } else {
        return res.json({ logged: false, message: "Login failed!" });
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ logged: false, message: "Internal Server Error" });
  }
});

router.post("/admin-login", async function (req, res) {
  let { password } = req.body;

  if (password === "admin") {
    res.json({ logged: true, message: "Admin logged in!" });
  } else res.json({ logged: false, message: "Admin login failed!" });
});

router.post("/register", async function (req, res, next) {
  try {
    let { password, username, email } = req.body;
    let user = await userModel.findOne({ username });
    let registered = false;

    if (user) {
      return res.json({ registered, message: "User already registered" });
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error("Error generating salt:", err);
        return res
          .status(500)
          .json({ registered: false, message: "Internal Server Error" });
      }

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res
            .status(500)
            .json({ registered: false, message: "Internal Server Error" });
        }

        try {
          let user = await userModel.create({
            email,
            password: hash,
            username,
          });

          let token = jwt.sign({ username }, "shaiq-auth");
          res.cookie("token", token, {
            httpOnly: true,
          });
          registered = true;
          res.json({
            registered,
            user,
            message: "User registered successfully",
          });
        } catch (error) {
          console.error("Error creating user:", error);
          res
            .status(500)
            .json({ registered: false, message: "Error creating user" });
        }
      });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ registered: false, message: "Internal Server Error" });
  }
});

router.get("/authenticate", async (req, res) => {
  let isAuthenticated = false;
  if (req.cookies.token) {
    isAuthenticated = true;
    res.json({ isAuthenticated, message: "User authenticated" });
  } else {
    res.json({ isAuthenticated, message: "User not authenticated" });
  }
});

module.exports = router;
