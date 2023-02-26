const express = require("express");
const router = express.Router();
require("dotenv").config();


//SQL Connection
const mysql = require("mysql");
const db = mysql.createPool({
    host: "sql658.main-hosting.eu",
    user: "u486424484_vynilsonline",
    password: "NitroS2021!",
    database: "u486424484_vynils"  
});

db.getConnection(async (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("--Connected to DB--");
    }
});

//gets the user passed on the query parameters after login
router.get("/:userId", async (req, res) => {

    let userName = `SELECT * FROM users WHERE id = ?`;

    db.query(userName, [req.params.userId], async function (err, rows){
        if (err) throw err
        else{
            res.json({
                name: rows[0].name
            })    
        }
    })


})

router.post("/addVinyl", async (req, res) => {
    // console.log(req.body)

    let sql = `INSERT INTO albums (title, author, genre, info, price, userId, image) `
    sql += `VALUES ("${req.body.name}", "${req.body.author}", "${req.body.genre}", "${req.body.info}", "${req.body.price}", "${req.body.user}", "${req.body.image}")`

    db.query(sql, async function (err, rows){
        if (err) throw err
        else{
            res.json({
                added: true
            })    
        }
    })
})

router.get("/getVinyls/:userId", async (req, res) => {
    let sql = `SELECT * FROM albums WHERE userId = "${req.params.userId}"`;

    db.query(sql, async function (err, rows){
        if (err) throw err
        else{
            res.json({albums: rows})    
        }
    })

})

router.get("/deleteVinyl/:albumId", async(req, res) => {

    let sql = `DELETE FROM albums WHERE id="${req.params.albumId}"`

    db.query(sql, async function (err, rows){
        if (err) throw err
        else{
            res.json({deleted: true})
        }
    })
})

module.exports = router;