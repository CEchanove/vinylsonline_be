const express = require("express");
const router = express.Router();
const mysql = require("mysql");
require("dotenv").config();
const bcrypt = require("bcryptjs");

//SQL connection
const db = mysql.createPool({
  host: "sql658.main-hosting.eu",
  user: "u486424484_vynilsonline",
  password: "NitroS2021!",
  database: "u486424484_vynils",
});

db.getConnection(async (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("--Connected to DB--");
  }
});

//login route
router.post("/", async (req, res) => {
  let { email, password } = req.body;

  if (email && password) {
    let userLogin = `SELECT * FROM users WHERE email = ?`;

    db.query(userLogin, [email], async function (err, rows) {
      if (err) console.log(err);
      //checks against sql injection. rejects 1=1
      if (typeof password != "string") {
        return res.status(400).json({ msg: "Invalid credentials." });
      } else {
        if (rows.length > 0) {
          //if user exists checks password
          const isMatch = bcrypt.compare(password, rows[0].password);

          if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials." });
          } else {
            res.json({
              id: rows[0].id,
              name: rows[0].name,
            });
          }
        }
      }
    });
  }
});

//registering a new user route
router.post("/register", async (req, res) => {
  let { name, surname, password, email } = req.body;

  let checkExistingUser = `SELECT * FROM users WHERE email = ?`;

  //checks the email doesn't exist on the db
  db.query(checkExistingUser, [email], async function (err, rows) {
    if (err) {
      throw err;
    } else if (rows.length === 1) {
      console.log("An account already exists with this email");
      return res
        .status(400)
        .json({ msg: "An account already exists with this email" });
    } else {
      //encrypting password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        name: name,
        surname: surname,
        email: email,
        password: passwordHash,
      };

      let sql = `INSERT INTO users (name, surname, email, password) VALUES ("${name}", "${surname}", "${email}", "${passwordHash}")`;

      console.log(`registering new user: ${sql}`);

      db.query(sql, function (err, rows) {
        if (err) {
          console.log(err);
        } else {
          // console.log(res)
          res.json("User Registered");
        }
      });
    }
  });
});

module.exports = router;
